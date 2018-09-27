// import Prompt from '../models/prompts/Prompt';
// import * as PromptTypes from '../models/prompts/PromptTypes'
// import Identity from '../models/Identity';
// import KeyPair from '../models/KeyPair';
// import Network from '../models/Network';
// import Error from '../models/errors/Error';
// import {LocationFields} from '../models/Identity';
// import * as HistoricEventTypes from '../models/histories/HistoricEventTypes'
// import ObjectHelpers from '../util/ObjectHelpers'
// import ContractHelpers from '../util/ContractHelpers'
// import NotificationService from './NotificationService'
// import Permission from '../models/Permission'
// import {Blockchains} from '../models/Blockchains';
// import PluginRepository from '../plugins/PluginRepository'
// import { IPlugin } from '../plugin/plugin.interface';
// import { KeychainUtils } from '../keychain/keychain.utils';
// import { NetworkError } from '../message/message.interface';
// import { AccountUtils } from '../account/account.utils';
// import { NetworkUtils } from '../network/network.utils';

// export default class SignatureService {
//     static requestSignature(payload, plugin: IPlugin, context, sendResponse){
//         const { domain, network, requiredFields } = payload;

//         // Checking if identity still exists
//         const identity = KeychainUtils.findIdentityFromDomain(plugin.keychain, domain);
//         if (!identity) {
//             sendResponse(NetworkError.identityMissing());
//             return false;
//         }

//         // Getting the account from the identity based on the network
//         const account = AccountUtils.networkedAccount(identity, NetworkUtils.fromJson(network));
//         if (!account) {
//             sendResponse(Error.signatureAccountMissing());
//             return false;
//         }

//         const blockchain = account.blockchain();

//         // Checking if Identity still has all the necessary accounts
//         const requiredAccounts = PluginRepository.plugin(blockchain).actionParticipants(payload);
//         const formattedName = PluginRepository.plugin(blockchain).accountFormatter(account);
//         if(!requiredAccounts.includes(formattedName) && !requiredAccounts.includes(account.publicKey)){
//             sendResponse(Error.signatureAccountMissing());
//             return false;
//         }

//         const sign = (returnedFields) => {
//             PluginRepository.plugin(blockchain).signer(context, payload, account.publicKey, signature => {
//                 if(!signature){
//                     sendResponse(Error.maliciousEvent());
//                     return false;
//                 }

//                 // Adding historic event
//                 context.addHistory(HistoricEventTypes.SIGNED_TRANSACTION, {
//                     domain,
//                     network,
//                     identityName:identity.name,
//                     publicKey:identity.publicKey,
//                     account:account,
//                     transaction:payload.transaction,
//                     hash:'' // <-- hmmm, what to do with this? There is no hash here to track yet. :(
//                 });

//                 sendResponse({
//                     signatures:[signature],
//                     returnedFields:returnedFields
//                 });
//             })
//         };



//         const hasTransactionPermissions = payload.messages.every(message => {
//             const {contract, action} = ContractHelpers.getContractAndActionNames(message);
//             const checksum = ContractHelpers.contractActionChecksum(contract, action, domain, network);
//             const fields = message.data;
//             return scatter.keychain.hasPermission(checksum, fields);
//         });

//         const needsLocationAndIdentityHasMultiple = (identity.locations.length > 1 && requiredFields.location.length);

//         if(!needsLocationAndIdentityHasMultiple && hasTransactionPermissions) {
//             const identityClone = identity.clone();
//             const returnedFields = Identity.asReturnedFields(requiredFields, identityClone, identityClone.locations[0]);
//             sign(returnedFields);
//         }

//         else NotificationService.open(new Prompt(PromptTypes.REQUEST_SIGNATURE, domain, network, payload, approval => {
//             if(!approval || !approval.hasOwnProperty('accepted')){
//                 sendResponse(Error.signatureError("signature_rejected", "User rejected the signature request"));
//                 return false;
//             }

//             if(approval.whitelisted){
//                 context.addPermissions(payload.messages.map(message => {
//                     const fields = message.data;
//                     const {contract, action} = ContractHelpers.getContractAndActionNames(message);
//                     const checksum = ContractHelpers.contractActionChecksum(contract, action, domain, network);
//                     return Permission.fromJson({
//                         domain,
//                         network,
//                         contract,
//                         action,
//                         identity:identity.publicKey,
//                         keypair:account.keypairUnique,
//                         checksum,
//                         timestamp:+ new Date(),
//                         mutableFields:approval.mutableFields,
//                         fields
//                     });
//                 }));
//             }

//             sign(approval.returnedFields);
//         }));
//     }

// }
