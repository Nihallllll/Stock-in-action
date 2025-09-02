// Contract addresses and ABIs for Hedgehog DeFi Protocol
export const CONTRACTS = {
    // Sepolia testnet addresses (mock addresses for demo)
    LENDING_POOL: '0x062E6C8C2612060Be292e1a1BEaC68954dB58047',
    COLLATERAL_VAULT: '0x4Af8fDd8920b071Cd4B89c68Bd01261a84A18fCd',
    ORACLE: '0x57cdfE44DfEa7c1979bc7aE0Ba435B7897a8F5F4',
    TOKEN_FACTORY: '0xCBD432A477ad6C2fCb53391430Cf661147a0A6df',
    MUSDC: '0xA2FC12A0bee99Bd9F427088AAB411F86Bb425922',
};
// Simplified ABIs for demo (in production, import from artifacts)
export const ABIS = {
    CUSTOM_TOKEN: [
        {
            "type": "constructor",
            "inputs": [
                { "name": "name_", "type": "string", "internalType": "string" },
                { "name": "symbol_", "type": "string", "internalType": "string" }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "allowance",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" },
                { "name": "spender", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "approve",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "balanceOf",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "burn",
            "inputs": [
                { "name": "from", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "decimals",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "mint",
            "inputs": [
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "name",
            "inputs": [],
            "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "symbol",
            "inputs": [],
            "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalSupply",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transfer",
            "inputs": [
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferFrom",
            "inputs": [
                { "name": "from", "type": "address", "internalType": "address" },
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                { "name": "newOwner", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "Approval",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "spender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Transfer",
            "inputs": [
                {
                    "name": "from",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "to",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "ERC20InsufficientAllowance",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" },
                { "name": "allowance", "type": "uint256", "internalType": "uint256" },
                { "name": "needed", "type": "uint256", "internalType": "uint256" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InsufficientBalance",
            "inputs": [
                { "name": "sender", "type": "address", "internalType": "address" },
                { "name": "balance", "type": "uint256", "internalType": "uint256" },
                { "name": "needed", "type": "uint256", "internalType": "uint256" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidApprover",
            "inputs": [
                { "name": "approver", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidReceiver",
            "inputs": [
                { "name": "receiver", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidSender",
            "inputs": [
                { "name": "sender", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidSpender",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ]
        }
    ],
    LENDING_POOL: [
        {
            "type": "constructor",
            "inputs": [
                { "name": "_mUSDC", "type": "address", "internalType": "address" }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "BONUS",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "availableLiquidity",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "borrow",
            "inputs": [
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "borrowerDebt",
            "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "changeBonus",
            "inputs": [
                { "name": "bonus", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "collateralVault",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "deposit",
            "inputs": [
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "fundPool",
            "inputs": [
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getHealthFactor",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getLenderDeposit",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getLenderWithdrawAmount",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getUserDebt",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "lenderDeposits",
            "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "outputs": [
                { "name": "_time", "type": "uint256", "internalType": "uint256" },
                {
                    "name": "_depositAmount",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "ltvBps",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "musdc",
            "inputs": [],
            "outputs": [
                { "name": "", "type": "address", "internalType": "contract IERC20" }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "repay",
            "inputs": [
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setCollateralVault",
            "inputs": [
                { "name": "_vault", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setLTV",
            "inputs": [
                { "name": "_ltvBps", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "totalBorrowed",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalPoolBalance",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                { "name": "newOwner", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "withdraw",
            "inputs": [
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "BonusUpdated",
            "inputs": [
                {
                    "name": "newBonus",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Borrowed",
            "inputs": [
                {
                    "name": "borrower",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "CollateralVaultSet",
            "inputs": [
                {
                    "name": "vault",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "LTVUpdated",
            "inputs": [
                {
                    "name": "newLtvBps",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "LenderDeposited",
            "inputs": [
                {
                    "name": "lender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "LenderWithdrawn",
            "inputs": [
                {
                    "name": "lender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Repaid",
            "inputs": [
                {
                    "name": "borrower",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ]
        },
        { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
        {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" }
            ]
        }
    ],
    COLLATERAL_VAULT: [
        {
            "type": "constructor",
            "inputs": [
                { "name": "_oracle", "type": "address", "internalType": "address" }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "collateralBalance",
            "inputs": [
                { "name": "", "type": "address", "internalType": "address" },
                { "name": "", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "depositCollateral",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getCollateralValue",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "getUserTokens",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [
                { "name": "", "type": "address[]", "internalType": "address[]" }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "lendingPool",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "maxBorrowable",
            "inputs": [
                { "name": "user", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "oracle",
            "inputs": [],
            "outputs": [
                { "name": "", "type": "address", "internalType": "contract IOracle" }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setLendingPool",
            "inputs": [
                { "name": "_pool", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setOracle",
            "inputs": [
                { "name": "_oracle", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "totalPoolCollateralBalance",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                { "name": "newOwner", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "withdrawCollateral",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "CollateralDeposited",
            "inputs": [
                {
                    "name": "user",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "token",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "CollateralWithdrawn",
            "inputs": [
                {
                    "name": "user",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "token",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "LendingPoolSet",
            "inputs": [
                {
                    "name": "pool",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OracleSet",
            "inputs": [
                {
                    "name": "oracle",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ]
        },
        { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
        {
            "type": "error",
            "name": "SafeERC20FailedOperation",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" }
            ]
        }
    ],
    ORACLE: [
        { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
        {
            "type": "function",
            "name": "getPrice",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "prices",
            "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "setPrice",
            "inputs": [
                { "name": "token", "type": "address", "internalType": "address" },
                { "name": "price", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                { "name": "newOwner", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ]
        }
    ],
    TOKEN_FACTORY: [
        { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
        {
            "type": "function",
            "name": "createStockToken",
            "inputs": [
                { "name": "symbol", "type": "string", "internalType": "string" }
            ],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getTokenAddress",
            "inputs": [
                { "name": "symbol", "type": "string", "internalType": "string" }
            ],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "mintStockToken",
            "inputs": [
                { "name": "symbol", "type": "string", "internalType": "string" },
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "owner",
            "inputs": [],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "renounceOwnership",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "stockTokens",
            "inputs": [{ "name": "", "type": "string", "internalType": "string" }],
            "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transferOwnership",
            "inputs": [
                { "name": "newOwner", "type": "address", "internalType": "address" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "OwnershipTransferred",
            "inputs": [
                {
                    "name": "previousOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "newOwner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "StockTokenCreated",
            "inputs": [
                {
                    "name": "symbol",
                    "type": "string",
                    "indexed": true,
                    "internalType": "string"
                },
                {
                    "name": "tokenAddress",
                    "type": "address",
                    "indexed": false,
                    "internalType": "address"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "StockTokenMinted",
            "inputs": [
                {
                    "name": "symbol",
                    "type": "string",
                    "indexed": true,
                    "internalType": "string"
                },
                {
                    "name": "to",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "OwnableInvalidOwner",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "OwnableUnauthorizedAccount",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ]
        }
    ],
    ERC20: [
        { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
        {
            "type": "function",
            "name": "allowance",
            "inputs": [
                { "name": "owner", "type": "address", "internalType": "address" },
                { "name": "spender", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "approve",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "balanceOf",
            "inputs": [
                { "name": "account", "type": "address", "internalType": "address" }
            ],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "burn",
            "inputs": [
                { "name": "from", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "decimals",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "mint",
            "inputs": [
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "amount", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "name",
            "inputs": [],
            "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "symbol",
            "inputs": [],
            "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalSupply",
            "inputs": [],
            "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "transfer",
            "inputs": [
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "transferFrom",
            "inputs": [
                { "name": "from", "type": "address", "internalType": "address" },
                { "name": "to", "type": "address", "internalType": "address" },
                { "name": "value", "type": "uint256", "internalType": "uint256" }
            ],
            "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "Approval",
            "inputs": [
                {
                    "name": "owner",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "spender",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Transfer",
            "inputs": [
                {
                    "name": "from",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "to",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "value",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "ERC20InsufficientAllowance",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" },
                { "name": "allowance", "type": "uint256", "internalType": "uint256" },
                { "name": "needed", "type": "uint256", "internalType": "uint256" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InsufficientBalance",
            "inputs": [
                { "name": "sender", "type": "address", "internalType": "address" },
                { "name": "balance", "type": "uint256", "internalType": "uint256" },
                { "name": "needed", "type": "uint256", "internalType": "uint256" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidApprover",
            "inputs": [
                { "name": "approver", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidReceiver",
            "inputs": [
                { "name": "receiver", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidSender",
            "inputs": [
                { "name": "sender", "type": "address", "internalType": "address" }
            ]
        },
        {
            "type": "error",
            "name": "ERC20InvalidSpender",
            "inputs": [
                { "name": "spender", "type": "address", "internalType": "address" }
            ]
        }
    ],
};
// Mock synthetic stock tokens
export const SYNTHETIC_STOCKS = [
    { symbol: 'tAAPL', name: 'Tokenized Apple', address: '0x318B484aD16F537F888C9C32735939920e2d6D36', price: "175" },
    { symbol: 'tTSLA', name: 'Tokenized Tesla', address: '0x676a2ccE81422091a4fe395508aBffAaa53897C8', price: "250" },
    { symbol: 'tGOOGL', name: 'Tokenized Google', address: '0x8FF1C5fE873745055AD98F3fc3d7413a3C516E84', price: "140" },
    { symbol: 'tMSFT', name: 'Tokenized Microsoft', address: '0xe20ef755fECe6706e6Ef8f53d77ccd84D388862C', price: "320" },
    { symbol: 'tAMZN', name: 'Tokenized Amazon', address: '0x5C91205403B5426f274f41FeF850c2a0cb099Fa9', price: "140" },
    { symbol: 'tNVDA', name: 'Tokenized NVIDIA', address: '0xD52a3C5DF9B321756dcd419a5474E5700f082E2b', price: "800" },
    { symbol: 'tNFLX', name: 'Tokenized Netflix', address: '0x51941b631F984310bBDaAB6fA2920E04E06A2582', price: "450" },
    { symbol: 'tCRM', name: 'Tokenized Salesforce', address: '0xCCF9cd3470A1EE36677F2A3e6F775aB655d23192', price: "250" },
    { symbol: 'tADBE', name: 'Tokenized Adobe', address: '0x0a40b2AeA35088C87DBfa0E8C7a6780ecA78bBb8', price: "500" },
    { symbol: 'tBA', name: 'Tokenized Boeing', address: '0x4551DdbB73AB31E1BAA3a9356656169DD849e1a7', price: "220" },
];
