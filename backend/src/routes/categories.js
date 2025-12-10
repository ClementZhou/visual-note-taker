import express from 'express'
import { supabase } from '../services/supabase.js'
import { SizeCalculator } from '../services/sizeCalculator.js'

const router = express.Router()

/**
 * GET /api/categories
 * Retrieve all top-level categories for the authenticated user
 * Query params: depth, sort, limit, offset
 */
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { depth = 1, sort = 'name', limit = 150, offset = 0 } = req.query

    // Fetch top-level categories (parent_id IS NULL)
    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .is('parent_id', null)
      .order(sort, { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: categories, error } = await query

    if (error) throw error

    // Optionally load children based on depth parameter
    let categoriesWithChildren = categories

    if (parseInt(depth) > 1) {
      categoriesWithChildren = await Promise.all(
        categories.map(async (cat) => {
          const children = await fetchCategoryChildren(cat.id, 1, parseInt(depth))
          return { ...cat, children }
        })
      )
    }

    // Fetch metrics for sizing
    const categoryIds = categories.map(c => c.id)
    const { data: metrics } = await supabase
      .from('metrics')
      .select('category_id, note_count, edit_frequency, last_edited')
      .in('category_id', categoryIds)

    const metricsMap = Object.fromEntries(
      metrics.map(m => [m.category_id, m])
    )

    // Calculate sizes
    const categoriesWithSizes = categoriesWithChildren.map(cat => ({
      ...cat,
      metrics: metricsMap[cat.id] || {},
      size: SizeCalculator.calculateSize(
        metricsMap[cat.id] || {},
        cat.manual_size_factor
      )
    }))

    res.json({
      success: true,
      count: categories.length,
      categories: categoriesWithSizes
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/categories/:id
 * Retrieve a specific category with all details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    // Fetch category
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Fetch metrics
    const { data: metrics } = await supabase
      .from('metrics')
      .select('*')
      .eq('category_id', id)
      .single()

    // Fetch notes count
    const { count: noteCount } = await supabase
      .from('notes')
      .select('id', { count: 'exact' })
      .eq('category_id', id)

    const categoryData = {
      ...category,
      metrics: metrics || {},
      size: SizeCalculator.calculateSize(metrics || {}, category.manual_size_factor),
      note_count: noteCount || 0
    }

    res.json({
      success: true,
      category: categoryData
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/categories/:id/children
 * Retrieve child categories (for lazy-loading beyond depth 10)
 * Query params: limit, offset
 */
router.get('/:id/children', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const { limit = 50, offset = 0 } = req.query

    // Verify parent exists and belongs to user
    const { data: parent, error: parentError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (parentError || !parent) {
      return res.status(404).json({
        success: false,
        error: 'Parent category not found'
      })
    }

    // Fetch direct children
    const { data: children, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', id)
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Fetch metrics for all children
    const childrenIds = children.map(c => c.id)
    const { data: metrics } = await supabase
      .from('metrics')
      .select('*')
      .in('category_id', childrenIds)

    const metricsMap = Object.fromEntries(
      metrics.map(m => [m.category_id, m])
    )

    const childrenWithSizes = children.map(child => ({
      ...child,
      metrics: metricsMap[child.id] || {},
      size: SizeCalculator.calculateSize(
        metricsMap[child.id] || {},
        child.manual_size_factor
      )
    }))

    res.json({
      success: true,
      parent_id: id,
      count: children.length,
      children: childrenWithSizes
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/categories
 * Create a new category
 */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { name, parent_id, description, color } = req.body

    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      })
    }

    // Check category limit (150 per user)
    const { count: categoryCount } = await supabase
      .from('categories')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)

    if (categoryCount >= 150) {
      return res.status(400).json({
        success: false,
        error: 'Category limit (150) reached'
      })
    }

    // Verify parent exists if parent_id is provided
    if (parent_id) {
      const { data: parent } = await supabase
        .from('categories')
        .select('id')
        .eq('id', parent_id)
        .eq('user_id', userId)
        .single()

      if (!parent) {
        return res.status(404).json({
          success: false,
          error: 'Parent category not found'
        })
      }
    }

    // Create category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: name.trim(),
        parent_id: parent_id || null,
        description: description || '',
        color: color || null,
        manual_size_factor: 1.0,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    // Initialize metrics for new category
    await supabase.from('metrics').insert({
      category_id: category.id,
      user_id: userId,
      note_count: 0,
      edit_frequency: 0,
      last_edited: null
    })

    res.status(201).json({
      success: true,
      category: {
        ...category,
        metrics: {},
        size: 0,
        note_count: 0
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/categories/:id
 * Update a category
 */
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { id } = req.params
    const updates = {}

    // Validate and prepare updates
    if (req.body.name !== undefined) {
      if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Category name cannot be empty'
        })
      }
      updates.name = req.body.name.trim()
    }

    if (req.body.parent_id !== undefined) {
      updates.parent_id = req.body.parent_id || null
      // Verify new parent exists if parent_id is provided
      if (req.body.parent_id) {
        const { data: parent } = await supabase
          .from('categories')
          .select('id')
          .eq('id', req.body.parent_id)
          .eq('user_id', userId)
          .single()

        if (!parent) {
          return res.status(404).json({
            success: false,
            error: 'Parent category not found'
          })
        }
      }
    }

    if (req.body.description !== undefined) {
      updates.description = req.body.description || ''
    }

    if (req.body.color !== undefined) {
      updates.color = req.body.color || null
    }

    if (req.body.manual_size_factor !== undefined) {
      const factor = Math.max(0.5, Math.min(req.body.manual_size_factor, 2.0))
      updates.manual_size_factor = factor
    }

    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error || !category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Fetch metrics
    const { data: metrics } = await supabase
      .from('metrics')
      .select('*')
      .eq('category_id', id)
      .single()

    res.json({
      success: true,
      category: {
        ...category,
        metrics: metrics || {},
        size: SizeCalculator.calculateSize(metrics || {}, category.manual_size_factor)
      }
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/categories/:id
 * Delete a category (cascades to children and notes)
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    // Verify category exists
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      })
    }

    // Delete all notes in this category and children
    await deleteCategoryRecursive(id, userId)

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * Helper: Fetch category children recursively
 */
async function fetchCategoryChildren(categoryId, currentDepth, maxDepth) {
  if (currentDepth >= maxDepth) {
    return []
  }

  const { data: children } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', categoryId)
    .order('name', { ascending: true })

  if (!children || children.length === 0) {
    return []
  }

  // Fetch metrics for children
  const childrenIds = children.map(c => c.id)
  const { data: metrics } = await supabase
    .from('metrics')
    .select('*')
    .in('category_id', childrenIds)

  const metricsMap = Object.fromEntries(
    metrics.map(m => [m.category_id, m])
  )

  // Recursively fetch grandchildren
  const childrenWithGrandchildren = await Promise.all(
    children.map(async (child) => {
      const grandchildren = await fetchCategoryChildren(
        child.id,
        currentDepth + 1,
        maxDepth
      )
      return {
        ...child,
        metrics: metricsMap[child.id] || {},
        size: SizeCalculator.calculateSize(
          metricsMap[child.id] || {},
          child.manual_size_factor
        ),
        children: grandchildren.length > 0 ? grandchildren : undefined
      }
    })
  )

  return childrenWithGrandchildren
}

/**
 * Helper: Delete category and all descendants
 */
async function deleteCategoryRecursive(categoryId, userId) {
  // Get all children
  const { data: children } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', categoryId)

  // Recursively delete children
  if (children && children.length > 0) {
    for (const child of children) {
      await deleteCategoryRecursive(child.id, userId)
    }
  }

  // Delete all notes in this category
  await supabase.from('notes').delete().eq('category_id', categoryId)

  // Delete metrics
  await supabase.from('metrics').delete().eq('category_id', categoryId)

  // Delete category
  await supabase.from('categories').delete().eq('id', categoryId)
}

export default router
