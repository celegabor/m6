import React from 'react';

const UserCard = ({ user }) => {

  return (
    <>
      <div className='card-details'>
        <img src={user.avatar} alt={user.name} />
        <div className='card-details-p'>
          <h5>{user.name}-{user.lastName}</h5>
          <p>Email: {user.email}</p>
          <p>Data di nascita: {user.dob}</p>
        </div>
      </div>

    </>
  );
};

export default UserCard;


