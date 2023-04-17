import React from 'react'

function table() {
  return (
    <div className='app-container'>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Subject Code</th>
                    <th>Subject Number</th>
                    <th>Template</th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>IT38004</td>
                <td>5</td>
                <td>abcd</td>
              </tr>
            </tbody>
        </table>
    </div>
  )
}

export default table