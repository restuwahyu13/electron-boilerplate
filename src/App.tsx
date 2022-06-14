import React, { useEffect, useState } from 'react'
import { ElectronApi } from './renderer/sockets'

const App: React.FC<any> = (): React.ReactElement => {
  const [text, setText] = useState<string>('')

  useEffect(() => {
    // send data into electron application
    ElectronApi.api.users.sendText('Minimalize Electron React Boilerplate')

    // get back data from electron application
    ElectronApi.api.users.getText((data: string) => setText(data))
  }, [])

  return (
    <div className="relative w-full h-full App">
      <div className="App-header">
        <code>
          {text} {new Date().getFullYear()}
        </code>
        <img
          src="https://raw.githubusercontent.com/restuwahyu13/react-boilerplate/9aaf34552ff9efab24b79f6cb50851fc169bfd74/src/logo.svg"
          className="App-logo"
          alt="logo"
        />
        <p>
          <code>Edit src/App.js and save to reload.</code>
        </p>
        <code>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </code>
        <p>
          <code>Electron React Boilerplate Powered By Coding Street Art Team &copy; {new Date().getFullYear()}</code>
        </p>
      </div>
    </div>
  )
}

export default App
