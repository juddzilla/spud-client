// list of convos
import ListView from '../../../../components/UI/List/View';

export default function Lists() {  
  const options = {
    defaultTitle: 'Collection',    
    nestingChildren: 'collections', 
    uri: 'collection'
  };

  return (<ListView options={{...options}} />);
}
