import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

/**
 * email_campaigns table:
 * Stores campaign metadata, content, target segment, approval lifecycle, and throttle rate.
 */
export const emailCampaigns = sqliteTable('email_campaigns', {
  id: text('id').primaryKey(), // UUID / nanoid
  title: text('title').notNull(), // Internal campaign title (e.g. "Q4 MiCA Stablecoin Update")
  subject: text('subject').notNull(), // Approved subject line
  preheader: text('preheader'), // Inbox preview preheader snippet
  templateName: text('template_name').notNull().default('base-institutional'),
  contentMarkdown: text('content_markdown').notNull(), // Source markdown copy
  targetSegmentId: text('target_segment_id'), // HubSpot list ID or filter segment tag
  totalRecipients: integer('total_recipients').default(0),
  status: text('status', {
    enum: ['draft', 'reviewing', 'scheduled', 'sending', 'completed', 'paused'],
  }).notNull().default('draft'),
  warmupRatePerHour: integer('warmup_rate_per_hour').default(25), // Hourly throttle cap
  createdAt: text('created_at').notNull(),
  approvedAt: text('approved_at'),
  approvedBy: text('approved_by'),
});

/**
 * campaign_recipients table:
 * Stores individual recipient dispatches, status progression, and tracking timestamps.
 */
export const campaignRecipients = sqliteTable(
  'campaign_recipients',
  {
    id: text('id').primaryKey(), // UUID
    campaignId: text('campaign_id')
      .notNull()
      .references(() => emailCampaigns.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    firstName: text('first_name'),
    company: text('company'),
    hubspotContactId: text('hubspot_contact_id'),
    status: text('status', {
      enum: ['pending', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'unsubscribed'],
    }).notNull().default('pending'),
    resendMessageId: text('resend_message_id'),
    sentAt: text('sent_at'),
    openedAt: text('opened_at'),
    clickedAt: text('clicked_at'),
    errorMessage: text('error_message'),
  },
  (table) => [
    index('campaign_recipients_campaign_status_idx').on(table.campaignId, table.status),
    index('campaign_recipients_email_idx').on(table.email),
  ]
);

/**
 * email_suppression_list table:
 * Critical table: Never cleared, checked before EVERY send.
 * Tracks unsubscribes, hard bounces, and spam complaints across all channels.
 */
export const emailSuppressionList = sqliteTable('email_suppression_list', {
  email: text('email').primaryKey(),
  reason: text('reason', {
    enum: ['unsubscribe', 'bounce', 'complaint', 'manual'],
  }).notNull(),
  source: text('source', {
    enum: ['one-click-header', 'landing-page', 'resend-webhook', 'manual'],
  }).notNull(),
  syncedToHubspot: integer('synced_to_hubspot', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type NewEmailCampaign = typeof emailCampaigns.$inferInsert;

export type CampaignRecipient = typeof campaignRecipients.$inferSelect;
export type NewCampaignRecipient = typeof campaignRecipients.$inferInsert;

export type EmailSuppression = typeof emailSuppressionList.$inferSelect;
export type NewEmailSuppression = typeof emailSuppressionList.$inferInsert;
