#!/bin/bash
# Prepara l'ambiente di lavoro del canvas. Da lanciare dalla radice del repo: bash docs/design/tools/setup.sh
# Imposta i percorsi di questa macchina nei file di tools/ (i sorgenti hanno i segnaposto @WORK@ e @REPO@).
# Prima di committare: bash docs/design/tools/setup.sh --reset  (rimette i segnaposto).
set -e
REPO="$(git rev-parse --show-toplevel)"; T="$REPO/docs/design/tools"; W="$T/work"
if [ "$1" = "--reset" ]; then
  grep -rl "$W" "$T/dsn" "$T/qa" --include=* 2>/dev/null | grep -v "/out/" | xargs -r sed -i "s#$W#@WORK@#g"
  grep -rl "$REPO" "$T/dsn" "$T/qa" 2>/dev/null | grep -v "/out/" | xargs -r sed -i "s#$REPO#@REPO@#g"
  echo "segnaposto ripristinati"; exit 0
fi
mkdir -p "$W/artifact-files/712252da-dd69-46bd-a8bc-d04b21af345f" "$W/zip"
ln -sfn "$T/dsn" "$W/dsn"; ln -sfn "$T/qa" "$W/qa"
ln -sfn "$REPO/docs/design/canvas" "$W/canvas"
ln -sfn "$REPO/docs/design/canvas" "$W/zip/canvas"
ln -sfn "$REPO/docs/design/canvas" "$W/artifact-files/712252da-dd69-46bd-a8bc-d04b21af345f/project"
mkdir -p "$W/lessc"; cp "$T/package.json" "$W/lessc/package.json"
(cd "$W/lessc" && [ -d node_modules/less ] || npm install --no-audit --no-fund)
grep -rl "@WORK@\|@REPO@" "$T/dsn" "$T/qa" | grep -v "/out/" | xargs -r sed -i "s#@WORK@#$W#g; s#@REPO@#$REPO#g"
echo "ok. Rigenera una pagina: cd $T/dsn && python3 p_planner.py   (output in dsn/out/)"
