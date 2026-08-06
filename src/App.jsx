import { useState } from 'react'
import './App.css'
import DitherBody from './components/ditherbody.jsx'
import { SmoothCorners } from '@lisse/react'
import MuxPlayer from '@mux/mux-player-react'


function App() {
  const [ctaHover, setCtaHover] = useState(false)
  const playbackIDS = [
    "ztLdGkBpL4w711Qa2bOXTsASAarQwy5kO102iKQXeIWM",
    "JjbhadJZjaItB02TKRP9v7Rz6S02ql87xrDvzcGYMoR2s",
    "C01M028ujZoFsoohIQ4I02T4PNHgXJ7M1p7ITpN00BntJes",
    "NpCr5F01GmrJOlox02b8jW00JAT4nb7BRSmnS401NgWB95M"  
  ]
  return (
    // #2B75FF blue
    // #FABEFF pink

    <div>
      <span className={`transition-opacity duration-300 ${ctaHover ? 'opacity-10' : 'opacity-[0.3]'}`}>
        <DitherBody palette={['#FABEFF', '#0b0b0f', '#2B75FF']} />
      </span>

      <div className='relative z-10 w-full flex justify-center items-center'>
        <div className="flex flex-col md:m-16 m-8 gap-10 md:gap-5 max-w-82.5 md:p-4 p-2 justify-center items-center">
          <div id='about-sticky' className='flex flex-col gap-3 max-w-82.5'>
            <img src="/mattr.svg" alt="Avatar" className='w-10 h-10 md:w-8 md:h-8' />
            <p className='text-3xl font-bold tracking-tight text-[var(--text-muted)]'><span className='text-[var(--text-primary)]'>16</span> yo <span className='text-[var(--text-primary)]'>solo Motion designer.</span> I <span className='text-[var(--text-primary)]'>design and animate motion for startups</span> and brands</p>
            <p className=' font-semibold tracking-tight text-[var(--text-muted)]'>Launch your next product, I'll take care of the showreel</p>
            <a
              href='https://wa.me/+8801407096332'
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
            >
              <SmoothCorners
                corners={{ radius: 15, smoothness: 0.6 }}
                style={{ backgroundColor: '#2B75FF', display: 'flex', alignItems: 'center', justifyContent: 'start' }}
                className='text-white py-3 px-4 pl-6 font-semibold w-full cursor-pointer'
              >
                Let's talk →
              </SmoothCorners>
            </a>
            <div className='flex mt-2 flex-row gap-1.5 justify-end items-center'>
              <a className='' href='https://li.mattr.art/x' target='_blank' rel='noopener noreferrer'>
                <SmoothCorners
                  corners={{ radius: 999, smoothness: 0.6 }}
                  style={{ backgroundColor: '#2B75FF', display: 'inline-flex', alignItems: 'center' }}
                  className='px-2 py-0.5 text-sm font-medium text-white backdrop-blur-md  cursor-pointer'
                >
                  X
                </SmoothCorners>
              </a>
              <a className='' href='https://li.mattr.art/insta' target='_blank' rel='noopener noreferrer'>
                <SmoothCorners
                  corners={{ radius: 999, smoothness: 0.6 }}
                  style={{ backgroundColor: '#2B75FF', display: 'inline-flex', alignItems: 'center' }}
                  className='px-2 py-0.5 text-sm font-medium text-white backdrop-blur-md  cursor-pointer'
                >
                  Instagram
                </SmoothCorners>
              </a>
              <a className='' href='mailto:hello@mattr.art' target='_blank' rel='noopener noreferrer'>
                <SmoothCorners
                  corners={{ radius: 999, smoothness: 0.6 }}
                  style={{ backgroundColor: '#FABFFF', display: 'inline-flex', alignItems: 'center' }}
                  className='px-2 py-0.5 text-sm font-medium text-black backdrop-blur-md  cursor-pointer'
                >
                  Email
                </SmoothCorners>
              </a>
            </div>
          </div>

          <div id='works' className='flex flex-col gap-5 md:w-[750px] w-screen px-6 justify-center items-center'>
            {playbackIDS.map((id) => (
              <MuxPlayer
                key={id}
                playbackId={id}
                className='w-full aspect-video rounded-2xl overflow-hidden'
                autoPlay="muted"
                primaryColor="#ffffff"
                accentColor="#ffffff"
                streamType="on-demand"
                loop
                nocontrols
                thumbnailTime={0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
