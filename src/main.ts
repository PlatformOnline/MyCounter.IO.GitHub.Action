import * as core from '@actions/core'

class ApiResponse {
  status?: boolean
  messages?: string[]
  data?: {
    value: number
  }
}

export async function run(): Promise<void> {
  try {
    const apikey = core.getInput('apikey', {
      required: true,
      trimWhitespace: true
    })
    const workspace = core.getInput('workspace', {
      required: true,
      trimWhitespace: true
    })
    const counter = core.getInput('counter', {
      required: true,
      trimWhitespace: true
    })
    const action = core.getInput('action', {
      required: true,
      trimWhitespace: true
    })
    const value = core.getInput('value', {
      required: false,
      trimWhitespace: true
    })

    core.debug(`API Key: ${apikey}`)
    core.debug(`Workspace: ${workspace}`)
    core.debug(`Counter: ${counter}`)
    core.debug(`Action: ${action}`)
    core.debug(`Value: ${value}`)

    let sendValue =
      value && !isNaN(parseInt(value)) ? parseInt(value) : undefined

    if (sendValue === undefined) {
      core.debug(
        `No valid value was provided; the default value for this operation will be 1.`
      )
      sendValue = 1
    }

    let processAction = action.toLowerCase()
    let processMethod = 'GET'
    switch (action) {
      case 'get':
        processAction = ''
        processMethod = 'GET'
        break
      case 'increment':
        processAction = '/increment'
        processMethod = 'POST'
        break
      case 'decrement':
        processAction = '/decrement'
        processMethod = 'POST'
        break
      case 'set':
        processAction = '/set'
        processMethod = 'POST'
        break
      default:
        core.setFailed(
          `Invalid action: ${action}. Valid actions are increment, decrement, reset.`
        )
        return
    }

    const response = await fetch(
      `https://api.mycounter.io/${workspace}/counter/${counter}${processAction}`,
      {
        method: processMethod,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': `${apikey}`
        },
        body:
          processMethod == 'GET'
            ? undefined
            : JSON.stringify({ value: sendValue })
      }
    )

    if (!response.ok) {
      core.setFailed(`Error performing action: ${response.statusText}`)
      core.setOutput('status', false)
      return
    }

    const data = (await response.json()) as ApiResponse
    if (!data.status) {
      core.setFailed(`${data.messages?.join(', ')}`)
      core.setOutput('status', false)
      return
    }
    if (data.status && data.data && typeof data.data.value) {
      const value = data.data.value
      core.debug(`Counter Value: ${value}`)

      core.setOutput('action', action)
      core.setOutput('value', value)
      core.setOutput('status', true)
      return
    } else {
      core.setFailed(`Invalid response from server.`)
      core.setOutput('status', false)
      return
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
      core.setOutput('status', false)
    }
  }
}
