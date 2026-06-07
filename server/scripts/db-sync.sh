#!/bin/bash
echo "Running database sync..."
# Pointing directly to server/src/models
node -e "require('$CODEBUILD_SRC_DIR/server/src/models').sequelize.sync({ force: true }).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })"