import TokenList from 'app/features/demo/TokenList'
const TokenListDemo = () => {
  return (
    <div>
      <div className="dropdown">
        <label tabIndex={0} className="m-1 btn">
          Click
        </label>
        <TokenList className={'p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52'} tabIndex={0}></TokenList>
      </div>
    </div>
  )
}
export default TokenListDemo
