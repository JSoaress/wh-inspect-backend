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
    pgm.sql(`
    INSERT INTO plans (id,name,price,is_paid,billing_cycle,max_projects,events_month,retention,replay_events,"support",created_at,updated_at,visible,is_active) VALUES
	 ('019a5698-2ced-7332-99ec-6b9ed99661de'::uuid,'Freenium',0.00,false,'monthly',1,50,3,false,'community','2025-11-05 21:35:33.449',NULL,true,true);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`TRUNCATE plans;`);
};
