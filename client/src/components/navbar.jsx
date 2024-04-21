const Navbar = () => {
  return (
    <div class="z-20 navbar h-20 bg-base-300/20 backdrop-filter backdrop-blur-lg">
      <div class="flex-none">
        <label for="my-drawer" class="cursor-pointer drawer-button ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div>
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/mint">
          <img width="40" height="40"
            src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/60/external-blockchain-cryptocurrency-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
            alt="external-blockchain-cryptocurrency-vitaliy-gorbachev-lineal-color-vitaly-gorbachev" />
          D.A.O.
        </a>
      </div>
    </div>)
}
export default Navbar
