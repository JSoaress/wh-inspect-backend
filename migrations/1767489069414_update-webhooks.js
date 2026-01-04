/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.alterColumn("webhooks", "headers", { type: "jsonb" });
    pgm.alterColumn("webhooks", "query", { type: "jsonb" });
    pgm.alterColumn("webhooks", "body", { type: "jsonb" });
    pgm.createIndex("webhooks", "headers jsonb_path_ops", { name: "idx_webhooks_headers_gin", method: "gin" });
    pgm.createIndex("webhooks", "query jsonb_path_ops", { name: "idx_webhooks_query_gin", method: "gin" });
    pgm.createIndex("webhooks", "body jsonb_path_ops", { name: "idx_webhooks_body_gin", method: "gin" });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    // empty
};
