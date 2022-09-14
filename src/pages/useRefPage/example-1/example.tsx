import React from 'react'
import { ResultCodeTable } from '../../../layout/resultCodeTable'
import { Code } from './code'
import { Result } from './result'

export default function Example() {
  return (
    <>
      <ResultCodeTable>
        <Code />
        <Result />
      </ResultCodeTable>
    </>
  )
}
