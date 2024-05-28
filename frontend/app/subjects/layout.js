import Navbar from '../components/navbar'

export default function Layout({ children }) {
  return (
    <main>
      <Navbar title="Subjects" />
      <div id='content-wrapper'>
        <div id='content'>
          {children}
        </div>
      </div>
    </main>
  )
}