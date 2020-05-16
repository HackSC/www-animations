import { render } from 'react-dom'
import React, { useState, useEffect, useRef } from 'react'
import { Canvas, Dom, useThree } from 'react-three-fiber'
import { Block } from './blocks'
import { Shapes, Categories, Box } from './Home'
import state from './store'
import './styles.css'

const HtmlContent = ({ className, style, children, portal }) => {
  const { size } = useThree()
  return (
    <Dom
      portal={portal}
      style={{
        position: 'absolute',
        top: -size.height / 2,
        left: -size.width / 2,
        width: size.width,
        height: size.height
      }}>
      <div className={className} style={style}>
        {children}
      </div>
    </Dom>
  )
}

const App = () => {
  const [events, setEvents] = useState()
  const domContent = useRef()
  const scrollArea = useRef()
  const onScroll = e => (state.top.current = e.target.scrollTop)
  useEffect(() => void onScroll({ target: scrollArea.current }), [])
  return (
    <>
      <Canvas
        colorManagement
        gl={{ alpha: false, antialias: true }}
        camera={{ position: [0, 0, 4.5], fov: 50, near: 0.1, far: 100 }}
        onCreated={({ gl, events }) => {
          gl.setClearColor('white')
          gl.toneMappingExposure = 2.5
          gl.toneMappingWhitePoint = 1
          // Export canvas events, we will put them onto the scroll area
          setEvents(events)
        }}>
        <Block factor={1.5} offset={0}>
          <Shapes />
          <HtmlContent portal={domContent}>
            <div className="menu left" style={{ top: '2.55rem' }}>
              <h2 className="main-title hacksc-linear-gradient">HackSC</h2>
            </div>
            <div className="menu right">
              <a className="no-decoration mx-10" href="https://2020.hacksc.com">
                <span>HackSC '20</span>
              </a>
              <a className="no-decoration mx-10" href="https://2019.hacksc.com">
                <span>HackSC '19</span>
              </a>
            </div>
            <div className="jumbo">
              <h1 className="hacksc-linear-gradient">
                Create.
                <br />
                Learn.
                <br />
                Inspire.
              </h1>
              <Categories />
            </div>
          </HtmlContent>
        </Block>

        <Block factor={1.5} offset={1}>
          <Box />
          <Dom portal={domContent}>
            <h2>Details</h2>
            <p style={{ wordWrap: 'break' }}>
              HackSC 2020 is a hackathon with a mission. Located in the heart of sunny Los Angeles, HackSC will provide a weekend full of
              innovation, connection, and education. In an interdisciplinary endeavor, join together with 800+ hackers, designers, and
              visionaries to engage in workshops, listen to speakers, and develop programs, tools, and relationships that can last for life.
              We hope to have you join us! For more information and updates, check out our social media and read our Medium Blog. You can
              check out what we were up to last year here.
            </p>
          </Dom>
        </Block>

        <Block factor={1.5} offset={2}>
          <Box />
          <Dom portal={domContent}>
            <h2>section 2</h2>
          </Dom>
        </Block>

        <Block factor={-2} offset={4}>
          <Box scale={[2, 2, 2]} />
          <Dom portal={domContent}>
            <h2>section 3</h2>
          </Dom>
        </Block>
      </Canvas>

      <div className="scrollArea" ref={scrollArea} onScroll={onScroll} {...events}>
        <div style={{ position: 'sticky', top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh` }} />
      </div>
    </>
  )
}

render(<App />, document.querySelector('#root'))
