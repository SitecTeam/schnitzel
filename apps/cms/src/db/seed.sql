-- Seed file for local development
-- Run with: bun run db:seed (from apps/cms)
-- This inserts sample episodes into the local D1 database.

INSERT OR IGNORE INTO episodes (id, episode_number, title, slug, guest_name, description, audio_url, published_at, status, updated_at, created_at)
VALUES
  (1, 1, 'The Future of Web Dev', 'the-future-of-web-dev', 'Jane Smith', 'Jane talks about where the web is heading in the next decade — from edge computing to AI-assisted development.', 'https://example.com/audio/ep1.mp3', '2026-01-10T10:00:00.000Z', 'published', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  (2, 2, 'Designing for Everyone', 'designing-for-everyone', 'Markus Braun', 'Markus walks us through inclusive design principles and how they improve products for all users.', 'https://example.com/audio/ep2.mp3', '2026-01-24T10:00:00.000Z', 'published', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  (3, 3, 'Scaling Startups on a Budget', 'scaling-startups-on-a-budget', 'Ana Kovac', 'Ana shares hard-won lessons from taking a startup from 0 to 100k users without burning cash.', 'https://example.com/audio/ep3.mp3', '2026-02-07T10:00:00.000Z', 'published', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  (4, 4, 'Open Source as a Career', 'open-source-as-a-career', 'Tobias Meier', 'Tobias explains how contributing to open source can open doors and build a sustainable career.', NULL, '2026-02-21T10:00:00.000Z', 'published', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  (5, 5, 'AI in Everyday Products', 'ai-in-everyday-products', 'Lena Horvat', 'Lena demystifies how AI features actually get built and shipped in regular consumer apps.', NULL, NULL, 'draft', strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'));
