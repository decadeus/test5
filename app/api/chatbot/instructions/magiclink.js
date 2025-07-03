export default function magiclinkInfo() {
  return `\nSi l'utilisateur pose des questions sur le magic link (lien magique) :\n- Explique que le magic link est une méthode de connexion sécurisée sans mot de passe.\n- Précise que l'utilisateur reçoit un email contenant un lien unique et temporaire.\n- En cliquant sur ce lien, il est automatiquement connecté à son compte sans avoir à saisir de mot de passe.\n- Souligne que cette méthode est simple, rapide et sécurisée, et qu'il faut vérifier ses spams si l'email n'est pas reçu. Why use Magic? 
Password leaks are prevalent.
Companies that have a database with passwords are a high-value target for hackers, who have successfully breached companies of all sizes.

Magic doesn’t use passwords; there's another option.
Passwords are only one (obsolete) way to handle authentication. Magic utilizes one-time passcodes to grant access. Delivered through email, these passcodes are time-bound tokens that enable authentication without having to store and maintain passwords. Optionally, Magic also partners with social providers to leverage cross-platform authentication for our products.

What about phishing?
Phishing is an ever-present threat on the internet
Since the creation of the internet, hackers have leveraged phishing to direct victims to authentic-looking pages to attack them or steal their credentials. Hackers can craft incredibly realistic pages, utilize social engineering to entice victims to connect, and capture credentials for later use in direct attacks or credential-stuffing attacks elsewhere on the internet.

Magic’s approach makes phishing more difficult
Magic’s approach to authentication makes phishing much more difficult. Because Magic uses time-bound tokens, any credentials captured from successful phishing attacks have the same limited shelf life. Magic’s innovative approach to device registration for authentication, for customers who wish to take advantage of it, dramatically increases the difficulty of phishing attempts.

With no passwords, how do you determine identity?
The “Magic” of public-private key pairs
Once an end-user uses their time-bound token to establish a session with Magic, Magic generates a key pair based on the Ethereum blockchain. The public key acts as an identifier for the user. Leveraging elliptic curve cryptography, the private key is used to generate a verifiable proof of identification and authorization from a claim. The proof is then sent to the developer application servers where data in the claim can be recovered, and the authenticity of the request can be ensured. 

Authentication and authorization are achieved without requiring user passwords. The claim format is an adaptation of the W3C Decentralized Identifiers (DID) protocol. Learn More about Magic DID's here.

Private keys can be lost or stolen. How do you protect my private key?
Patented key management
With this public-private key-pair approach, it is critical to ensure that users' private keys are properly secured. This is what our patented (Patent US-11546321-B2) Delegated Key Management System (DKMS) was designed for. Our DKMS has secured millions of private keys for thousands of companies for years. By leveraging our DKMS, Magic provides secure private key management backed by best-in-class cryptography standards.`;
} 