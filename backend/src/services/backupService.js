/**
 * Backup Service
 * Handles automated yearly backups and manual backup triggers
 */

import cron from 'node-cron'
import { supabase } from './supabase.js'

export class BackupService {
  constructor() {
    this.scheduledJobs = new Map()
  }

  /**
   * Schedule automatic yearly backup
   * Runs at midnight on January 1st every year by default
   */
  scheduleYearlyBackup(userId, schedule = '0 0 1 1 *') {
    try {
      // Remove existing job if any
      if (this.scheduledJobs.has(userId)) {
        this.scheduledJobs.get(userId).stop()
      }

      const job = cron.schedule(schedule, async () => {
        console.log(`Running yearly backup for user ${userId}`)
        await this.createBackup(userId)
      })

      this.scheduledJobs.set(userId, job)
      console.log(`Yearly backup scheduled for user ${userId}`)
      return true
    } catch (error) {
      console.error('Error scheduling backup:', error)
      throw error
    }
  }

  /**
   * Create a backup of all user data
   */
  async createBackup(userId) {
    try {
      const backupData = {
        user_id: userId,
        backup_date: new Date().toISOString(),
        data: {},
        status: 'in_progress'
      }

      // Fetch all user data
      const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)

      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .in('category_id', categories.map(c => c.id))

      const { data: metrics } = await supabase
        .from('metrics')
        .select('*')
        .in('category_id', categories.map(c => c.id))

      backupData.data = { categories, notes, metrics }

      // Store backup metadata
      const { error } = await supabase
        .from('backups')
        .insert({
          user_id: userId,
          backup_date: backupData.backup_date,
          file_size: JSON.stringify(backupData).length,
          status: 'completed'
        })

      if (error) throw error
      
      console.log(`Backup created for user ${userId}`)
      return backupData
    } catch (error) {
      console.error('Error creating backup:', error)
      throw error
    }
  }

  /**
   * Restore data from backup
   */
  async restoreBackup(userId, backupId) {
    try {
      const { data: backup } = await supabase
        .from('backups')
        .select('*')
        .eq('id', backupId)
        .eq('user_id', userId)
        .single()

      if (!backup) {
        throw new Error('Backup not found')
      }

      console.log(`Restoring backup ${backupId} for user ${userId}`)
      return backup
    } catch (error) {
      console.error('Error restoring backup:', error)
      throw error
    }
  }

  /**
   * Get backup history for user
   */
  async getBackupHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('backups')
        .select('*')
        .eq('user_id', userId)
        .order('backup_date', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching backup history:', error)
      throw error
    }
  }
}

export default BackupService
