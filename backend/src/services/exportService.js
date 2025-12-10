/**
 * Export Service
 * Handles CSV and Excel export functionality
 */

import { writeFile } from 'fs/promises'
import { stringify } from 'csv-stringify/sync'
import ExcelJS from 'exceljs'

export class ExportService {
  /**
   * Export categories and notes as CSV
   */
  async exportAsCSV(categories, notes, filePath) {
    try {
      const records = []
      
      // Flatten hierarchical structure for CSV
      const flattenCategories = (cats, depth = 0) => {
        cats.forEach(cat => {
          records.push({
            depth,
            id: cat.id,
            name: cat.name,
            parent_id: cat.parent_id,
            description: cat.description,
            created_at: cat.created_at,
            modified_at: cat.modified_at
          })
          
          if (cat.children && cat.children.length > 0) {
            flattenCategories(cat.children, depth + 1)
          }
        })
      }
      
      flattenCategories(categories)
      
      const csv = stringify(records, {
        header: true,
        columns: ['depth', 'id', 'name', 'parent_id', 'description', 'created_at', 'modified_at']
      })
      
      await writeFile(filePath, csv)
      return { success: true, filePath, format: 'csv' }
    } catch (error) {
      console.error('CSV export error:', error)
      throw error
    }
  }

  /**
   * Export categories and notes as Excel
   */
  async exportAsExcel(categories, notes, filePath) {
    try {
      const workbook = new ExcelJS.Workbook()
      
      // Add categories sheet
      const categoriesSheet = workbook.addWorksheet('Categories')
      categoriesSheet.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'Parent ID', key: 'parent_id' },
        { header: 'Description', key: 'description' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Modified At', key: 'modified_at' }
      ]
      
      const flattenedCategories = []
      const flatten = (cats) => {
        cats.forEach(cat => {
          flattenedCategories.push({
            id: cat.id,
            name: cat.name,
            parent_id: cat.parent_id,
            description: cat.description,
            created_at: cat.created_at,
            modified_at: cat.modified_at
          })
          if (cat.children) flatten(cat.children)
        })
      }
      flatten(categories)
      categoriesSheet.addRows(flattenedCategories)
      
      // Add notes sheet
      const notesSheet = workbook.addWorksheet('Notes')
      notesSheet.columns = [
        { header: 'ID', key: 'id' },
        { header: 'Category ID', key: 'category_id' },
        { header: 'Title', key: 'title' },
        { header: 'Content', key: 'content' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Modified At', key: 'modified_at' }
      ]
      notesSheet.addRows(notes)
      
      await workbook.xlsx.writeFile(filePath)
      return { success: true, filePath, format: 'excel' }
    } catch (error) {
      console.error('Excel export error:', error)
      throw error
    }
  }
}

export default ExportService
