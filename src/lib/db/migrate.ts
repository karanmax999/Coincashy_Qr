import { client } from './index';

/**
 * Migration runner: ensures email_campaigns, campaign_recipients, and
 * email_suppression_list tables and performance indexes exist in Turso SQLite.
 */
export async function runMigrations() {
  console.log('[Turso Migration] Applying database schema migrations...');

  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_campaigns (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      preheader TEXT,
      template_name TEXT NOT NULL DEFAULT 'base-institutional',
      content_markdown TEXT NOT NULL,
      target_segment_id TEXT,
      total_recipients INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'draft',
      warmup_rate_per_hour INTEGER DEFAULT 25,
      created_at TEXT NOT NULL,
      approved_at TEXT,
      approved_by TEXT
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS campaign_recipients (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      first_name TEXT,
      company TEXT,
      hubspot_contact_id TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      resend_message_id TEXT,
      sent_at TEXT,
      opened_at TEXT,
      clicked_at TEXT,
      error_message TEXT
    );
  `);

  await client.execute(`
    CREATE INDEX IF NOT EXISTS campaign_recipients_campaign_status_idx 
    ON campaign_recipients (campaign_id, status);
  `);

  await client.execute(`
    CREATE INDEX IF NOT EXISTS campaign_recipients_email_idx 
    ON campaign_recipients (email);
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_suppression_list (
      email TEXT PRIMARY KEY,
      reason TEXT NOT NULL,
      source TEXT NOT NULL,
      synced_to_hubspot INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  console.log('[Turso Migration] Schema migrations applied successfully.');
}

// Allow direct CLI execution: node src/lib/db/migrate.ts
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Turso Migration Error]', err);
      process.exit(1);
    });
}
