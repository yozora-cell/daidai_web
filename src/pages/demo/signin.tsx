import PleaseSignIn from 'app/components/PleaseSignIn'
import { useActiveWeb3React } from 'app/services/web3'
const SignIn = () => {
  const { account } = useActiveWeb3React()
  return account ? <p>已经登录钱包了 {account}</p> : <PleaseSignIn></PleaseSignIn>
}
export default SignIn
