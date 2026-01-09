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
    pgm.createTable("project_usage", {
        id: "id",
        project_id: { type: "uuid", references: '"projects"', notNull: true },
        year_month: { type: "varchar(7)", notNull: true },
        max_events: { type: "integer", notNull: true, default: 0 },
        events_count: { type: "integer", notNull: true, default: 0 },
        updated_at: { type: "datetime" },
    });
    pgm.createConstraint("project_usage", "unq_project_usage_project_id_year_month", {
        unique: ["project_id", "year_month"],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("project_usage");
};
