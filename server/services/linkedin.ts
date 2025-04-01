import axios from 'axios';
import { Request } from 'express';

// Configuration LinkedIn
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? 'https://votredomaine.com/api/auth/linkedin/callback' 
  : 'https://93e1e4b2-88ee-458f-aa8c-87dcdd2cf9c5.id.repl.co/api/auth/linkedin/callback';

// URLs de l'API LinkedIn
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

/**
 * Génère l'URL d'autorisation LinkedIn
 */
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID as string,
    redirect_uri: REDIRECT_URI,
    state,
    scope: 'r_liteprofile r_emailaddress w_member_social',
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

/**
 * Échange le code d'autorisation contre un jeton d'accès
 */
export async function getAccessToken(code: string): Promise<string> {
  try {
    const response = await axios.post(LINKEDIN_TOKEN_URL, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du jeton d\'accès LinkedIn:', error);
    throw new Error('Échec de l\'authentification LinkedIn');
  }
}

/**
 * Récupère les informations de l'utilisateur LinkedIn
 */
export async function getUserProfile(accessToken: string): Promise<any> {
  try {
    const response = await axios.get(`${LINKEDIN_API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil LinkedIn:', error);
    throw new Error('Échec de la récupération du profil LinkedIn');
  }
}

/**
 * Publie un article sur LinkedIn
 */
export async function sharePost(
  accessToken: string, 
  {text, title, url, imageUrl}: {text: string; title: string; url: string; imageUrl?: string}
): Promise<any> {
  try {
    // Format conforme à l'API LinkedIn pour le partage de contenu
    const contentPayload = {
      author: "urn:li:person:{PERSON_ID}", // Sera remplacé dynamiquement
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              description: {
                text: title
              },
              originalUrl: url,
              ...(imageUrl && { thumbnail: imageUrl })
            }
          ]
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    // D'abord, nous devons obtenir l'ID de la personne
    const userProfile = await getUserProfile(accessToken);
    
    // Remplacer l'ID de la personne dans la charge utile
    contentPayload.author = `urn:li:person:${userProfile.id}`;

    // Partager le contenu
    const response = await axios.post(
      `${LINKEDIN_API_URL}/ugcPosts`,
      contentPayload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Erreur lors du partage sur LinkedIn:', error);
    throw new Error('Échec du partage sur LinkedIn');
  }
}

/**
 * Vérifie si le jeton d'accès est valide
 */
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    await getUserProfile(accessToken);
    return true;
  } catch (error) {
    return false;
  }
}

// Stockage temporaire des jetons (en production, utilisez une base de données)
const tokenStore: Record<string, string> = {};

export function storeAccessToken(userId: number, accessToken: string): void {
  tokenStore[userId.toString()] = accessToken;
}

export function getStoredAccessToken(userId: number): string | null {
  return tokenStore[userId.toString()] || null;
}