import './App.css';
import { useState } from 'react';

import RestaurantTable from './RestaurantTable';
function App(){
  const [userName, setUserName] = useState();


 
return(
   <div  id='mystyle'>  
   <RestaurantTable />
 </div>
);
}  
export default App;