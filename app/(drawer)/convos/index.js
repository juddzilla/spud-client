import ListView from '../../../components/UI/List/View';

export default function Convos() {  
  const options = {
    defaultTitle:'Conversations',
    detail:'/convos',
    uri:'convos'
  };

  return (<ListView options={{...options}} />);
}
