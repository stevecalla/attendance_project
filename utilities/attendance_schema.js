const attendance_schema = [
    {
        "name": "attendance_id",
        "mode": "NULLABLE",
        "type": "INTEGER",
        "description": null,
        "fields": []
    },
    {
        "name": "school_id",
        "mode": "NULLABLE",
        "type": "INTEGER",
        "description": null,
        "fields": []
    },
    {
        "name": "class_id",
        "mode": "NULLABLE",
        "type": "INTEGER",
        "description": null,
        "fields": []
    },
    {
        "name": "teacher_id",
        "mode": "NULLABLE",
        "type": "INTEGER",
        "description": null,
        "fields": []
    },
    {
        "name": "student_id",
        "mode": "NULLABLE",
        "type": "INTEGER",
        "description": null,
        "fields": []
    },
    {
        "name": "attendance_date",
        "mode": "NULLABLE",
        "type": "DATE",
        "description": null,
        "fields": []
    },
    {
        "name": "is_present",
        "mode": "NULLABLE",
        "type": "BOOLEAN",
        "description": null,
        "fields": []
    },
    {
        "name": "notes",
        "mode": "NULLABLE",
        "type": "STRING",
        "description": null,
        "fields": []
    },
    {
        "name": "created_at",
        "mode": "NULLABLE",
        "type": "TIMESTAMP",
        "description": null,
        "fields": []
    },
    {
        "name": "updated_at",
        "mode": "NULLABLE",
        "type": "TIMESTAMP",
        "description": null,
        "fields": []
    },
];

// console.log(booking_schema.length);

module.exports = {
    attendance_schema,
}