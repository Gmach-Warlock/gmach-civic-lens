#!/bin/bash
echo "Running database sync..."
# We use $CODEBUILD_SRC_DIR/server/models to guarantee we hit the right folder
node -e "require('$CODEBUILD_SRC_DIR/server/models').sequelize.sync({ force: true }).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })"