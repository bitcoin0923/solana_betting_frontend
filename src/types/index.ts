export interface NftStakedInfo {
  endTime: number;
  teamANames: string[];
  teamBNames: string[];
  teamANfts: string;
  teamBNfts: string;
}

export interface TwitterFeed {
  id: string;
  text: string;
  createdAt: Date;
  name: string;
  username: string;
  profileImg: string;
}

export interface ProjectInfo {
  collectionSize: number;
  contract: string;
  headerImage: string;
  id: string;
  logo: string;
  magicEdenLink: string;
  name: string;
  openSeaLink: string;
  subName: string;
  twitterID: string;
}

export interface BattleInfo {
  id: string;
  battleId: string;
  projectL: ProjectInfo;
  projectR: ProjectInfo;
  startDate: string;
  endDate: string;
}

export interface MyBattleInfo {
  userBetAmountA: number;
  userBetAmountB: number;
  userNftStakedA: number;
  userNftStakedB: number;
}

export interface BattleDetailType {
  battleInfo: BattleInfo | null;
  totalBetAmountA: number;
  totalBetAmountB: number;
  totalNftStakedA: number;
  totalNftStakedB: number;
  updateBetInfo: () => void;
  userBetAmountA: number;
  userBetAmountB: number;
  userNftStakedA: number;
  userNftStakedB: number;
  updateUserInfo: () => void;
  updateUserNftList: () => void;
  winnerSet: boolean;
  winner: boolean;
  placeBet: (amount: number, side: boolean) => Promise<boolean>;
  getRewardPotential: (side: boolean) => number;
  getChance: (side: boolean) => number;
  stakeNft: (tokenIds: number[], side: boolean) => Promise<boolean>;
}
