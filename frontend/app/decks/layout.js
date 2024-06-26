import Navbar from '../components/navbar'

export default function Layout({ children }) {
  return (
    <main>
      <Navbar title="Decks" />
      <div id='content-wrapper'>
        <div id='content'>
          {children}
        </div>
      </div>
    </main>
  )
}