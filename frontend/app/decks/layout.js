import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <main>
      <Navbar />
      <div id='content-wrapper'>
        <div id='content'>
          {children}
        </div>
      </div>
    </main>
  )
}