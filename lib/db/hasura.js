export async function findVideoIdByUser(token, user_id, video_id) {
  // constante qui contient l'operation pour la mutation
  const operationsDoc = `
  query findVideoIdByUserId($user_id: String!, $video_id: String!) {
    netflix_stats(where: {video_id: {_eq: $video_id},user_id: {_eq: $user_id}}) {
      id
      user_id
      video_id
      watched
      favourited
    }
    }
  `;

  //   // console.log("metadata ", { issuer, email, publicAddress });
  const response = await queryHasuraGraph(
    operationsDoc,
    "findVideoIdByUserId",
    { user_id, video_id },
    token
  );

  return response?.data?.netflix_stats;
}

/**
 * AJOUTE UNE NOUVELLE LIGNE CONCERNANT L'UTILISATEUR SUR LA VIDÉO QU'IL CONSULTE SI C'EST LA PREMIÈRE FOIS
 * @param {*} token
 * @param {*} param1
 * @returns
 */
export async function addStats(
  token,
  { favourited, watched, user_id, video_id }
) {
  const operationsDoc = `
  mutation insertStats($user_id: String!, $video_id: String!, $favourited: Int!, $watched: Boolean!) {
    insert_netflix_stats(objects: {favourited: $favourited, user_id: $user_id, video_id: $video_id, watched: $watched}) {
      affected_rows
      returning {
        favourited
        id
        user_id
        video_id
        watched
      }
    }
  }
`;
  return await queryHasuraGraph(
    operationsDoc,
    "insertStats",
    { favourited, watched, user_id, video_id },
    token
  );
}

export async function updateStats(
  token,
  { favourited, watched, user_id, video_id }
) {
  //   // constante qui contient l'operation pour la mutation

  const operationsDoc = `
  mutation updateStats($user_id: String!, $video_id: String!, $favourited: Int!, $watched: Boolean!) {
    update_netflix_stats(_set: {watched: $watched, favourited: $favourited}, where: {user_id: {_eq: $user_id}, video_id: {_eq: $video_id}}) {
      returning {
        watched
        video_id
        user_id
        id
        favourited
      }
    }
  }
  `;

  return await queryHasuraGraph(
    operationsDoc,
    "updateStats",
    { favourited, watched, user_id, video_id },
    token
  );
}

// // /**
// //  * CRÉÉE UN NOUVEL UTILISATEUR S'IL N'EST PAS PRESENT EN BDD
// //  * @token {string} : le token de l'utilisateur
// //  * @metadata {string} : contient les infos du token
// //  */
export async function createNewUser(token, metadata) {
  // constante qui contient l'operation pour la mutation
  console.log({token})
  const operationsDoc = `
mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_netflix_users(objects: {email: $email, publicAddress: $publicAddress, issuer: $issuer}) {
      returning {
        issuer
        id
        email
      }
    }
  }
`;

  // DESTRUCTURE L'OBJET METADATA POUR PASSER EN VARIABLE LES INFORMATIONS REQUISES
  const { issuer, email, publicAddress } = metadata;

  const response = await queryHasuraGraph(
    operationsDoc,
    "createNewUser",
    { issuer, email, publicAddress },
    token
  );

  return response;
}

// /**
//  * CHECK SI L'UTILISATEUR EST PRESENT EN BASE DE DONNÉE
//  * @param {*} token : Recupere le token de l'utilisateur connecté
//  * @param {*} issuer : DID de l'utilisateur
//  * @returns : retourne true si l'utilisateur existe
//  */
export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) { 
    netflix_users(where: {issuer: {_eq: $issuer}}) {
      publicAddress
      issuer
      id
      email
    }
  }
`;

  const response = await queryHasuraGraph(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );

  return response.data.netflix_users.length === 0;
}

export async function queryHasuraGraph(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export const getWatchedVideos = async (user_id, token) => {
  // console.log("getWatchedVideos", { token, user_id });
  const operationsDoc = `
  query watchedVideos($user_id: String!{
    netflix_stats(where: {
      user_id: {_eq: $user_id}, 
      watched: {_eq: true}
    }) {
      video_id,
      user_id,
      watched
    }
  }
`;

console.log(operationsDoc, user_id, token)

const response = await queryHasuraGraph({operationsDoc , user_id, token})

  console.log(response);
  return response?.data?.netflix_stats;
};
