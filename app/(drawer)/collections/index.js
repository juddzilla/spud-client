// list of convos
import ListView from '../../../components/UI/List/View';

export default function Collections() {  
  const options = {
    defaultTitle:'Collectionss',    
    uri: 'collections'
  };

  return (<ListView options={options} />);
}
