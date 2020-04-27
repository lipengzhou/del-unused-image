#!/usr/bin/env node

const globby = require('globby')
const trash = require('trash')
const fs = require('fs')
const path = require('path')

;(async () => {
  // find all image files
  const imagePaths = await globby([
    '**/*.(png|jpg|jpeg|gif|svg|bmp|webp)',
    '!node_modules/'
  ], {
    onlyFiles: true
  })

  // find all markdown files
  const mdPaths = await globby([
    '**/*.md',
    '!node_modules/'
  ], {
    onlyFiles: true
  })

  // aggregated all markdown files
  const totalContent = mdPaths.reduce((prev, curr) => {
    return fs.readFileSync(curr, 'utf8') + prev
  }, '')

  // find unused image file and delete it
  const tasks = imagePaths.filter(fullPath => {
    const imgName = path.basename(fullPath)
    if (totalContent.indexOf(imgName) === -1) {
      return trash(fullPath)
    }
  })

  await Promise.all(tasks)

  console.log('操作完成')
})()
