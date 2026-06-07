#!/bin/bash
echo "Running database sync..."
# Change '../models' to './models' 
node -e "require('./models').sequelize.sync({ force: true }).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })"