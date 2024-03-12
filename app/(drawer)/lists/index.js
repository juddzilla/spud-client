// list of convos
import ListView from '../../../components/UI/List/View';

export default function Lists() {  
  const options = {
    defaultTitle: 'Lispts',
    detail:'/lists',    
    uri: 'lists'
  };

  return (<ListView options={{...options}} />);
}
