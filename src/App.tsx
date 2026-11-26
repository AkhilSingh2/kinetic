import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { Preloader } from './components/Preloader'
import { ReserveDialog } from './components/ReserveDialog'
import { SmoothScroll } from './components/SmoothScroll'
import { TransitionProvider } from './components/Transition'
import { IntroProvider } from './context/Intro'
import { Gallery } from './pages/Gallery'
import { NotFound } from './pages/NotFound'
import { Product } from './pages/Product'
import { Specs } from './pages/Specs'
import { Story } from './pages/Story'

export default function App() {
  return (
    <IntroProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <SmoothScroll>
          <TransitionProvider>
            <div className="grain" aria-hidden="true" />
            <Cursor />
            <Nav />
            <main id="content">
              <Routes>
                <Route path="/" element={<Product />} />
                <Route path="/specs" element={<Specs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/story" element={<Story />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ReserveDialog />
            <Preloader />
          </TransitionProvider>
        </SmoothScroll>
      </BrowserRouter>
    </IntroProvider>
  )
}
