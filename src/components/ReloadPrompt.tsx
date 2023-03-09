import { useRegisterSW } from 'virtual:pwa-register/react'

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <>
      {offlineReady || needRefresh ? (
        <div className='toast toast-center w-full max-w-4xl'>
          <div className='alert alert-info w-full'>
            <div>
              {offlineReady ? (
                <span>App ready to work offline</span>
              ) : (
                <span>New content available, click on reload button to update.</span>
              )}
            </div>
            {needRefresh && (
              <button
                className='ReloadPrompt-toast-button'
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
            )}
            <button className='ReloadPrompt-toast-button' onClick={() => close()}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ReloadPrompt
