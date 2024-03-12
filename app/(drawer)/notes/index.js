// list of convos
import ListView from '../../../components/UI/List/View';

export default function Notes() {  
  const options = {
    defaultTitle: 'Notez',
    detail: '/notes',
    uri: 'notes'
  };

  return (<ListView options={{...options}} />);
}
