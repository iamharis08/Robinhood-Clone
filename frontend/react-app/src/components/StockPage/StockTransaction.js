// import React from "react";
// import { NavLink } from "react-router-dom";
// import LogoutButton from "../auth/LogoutButton";
// import "../../css/NavBar.css";

// const StockTransaction = () => {
//   return (
//     <div className="stock-transaction-container">
//       <div className="stock-transaction">
//         <div className="transaction-header">Buy {stockSymbol}</div>
//         <div className="transaction-form">
//           <div className="order-type">
//             Order Type <span>Market Order</span>
//           </div>
//           <div className="buy-in">
//             <span>Buy In </span>
//             <div
//               className="buy-type-dropdown-container"
//               onClick={() => setClickedDropDown(!clickedDropdown)}
//             >
//               {clickedBuyIn}
//             </div>
//             {clickedDropdown && (
//               <div className="buy-type-dropdown">
//                 <div className="Shares">Shares</div>
//                 <div className="Dollars">Dollars</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <div
//         className="add-stock-watchlist"
//         onClick={() => setShowAddModal(true)}
//       >
//         <div className="add-stock-button">Add to Lists</div>
//       </div>
//     </div>
//   );
// };

// export default StockTransaction;
