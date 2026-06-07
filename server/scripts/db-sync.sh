#!/bin/bash
# This is a standard bash script, no YAML escaping needed!
echo "Running database sync..."
node -e "require('../models').sequelize.sync({ force: true }).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })"