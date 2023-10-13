import React from 'react';


const UserCard = ({ user }) => {
  return (
    <div className='card-details'>
      <img src={user.avatar} alt={user.name} />
      <h5> name: {user.name}</h5>
      <h5>LastName: {user.lastName}</h5>
      <p>Email: {user.email}</p>
      <p>Data di nascita: {user.dob}</p>
    </div>
  );
};

export default UserCard;


