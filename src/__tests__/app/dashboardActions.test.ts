import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

function hasExportModifier(node: ts.Node) {
  return ts.canHaveModifiers(node) && ts.getModifiers(node)?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)
}

describe('dashboard server actions', () => {
  it('only exposes async functions as runtime exports', () => {
    const filePath = path.join(process.cwd(), 'src/app/dashboard/actions.ts')
    const sourceText = fs.readFileSync(filePath, 'utf8')
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true)

    const invalidExports = sourceFile.statements
      .map(statement => {
        if (ts.isExportDeclaration(statement) && !statement.isTypeOnly) {
          return statement.getText(sourceFile)
        }

        if (ts.isVariableStatement(statement) && hasExportModifier(statement)) {
          return statement.getText(sourceFile)
        }

        if (ts.isFunctionDeclaration(statement) && hasExportModifier(statement)) {
          const isAsync = ts.getModifiers(statement)?.some(mod => mod.kind === ts.SyntaxKind.AsyncKeyword)
          return isAsync ? null : statement.getText(sourceFile)
        }

        return null
      })
      .filter(Boolean)

    expect(invalidExports).toEqual([])
  })
})
