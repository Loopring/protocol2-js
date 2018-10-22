import { BigNumber } from "bignumber.js";

export class BalanceBook {
  private balances: { [id: string]: any; } = {};

  public getBalance(owner: string, token: string, tranche: string) {
    if (this.isBalanceKnown(owner, token, tranche)) {
        return this.balances[owner][token][tranche];
    } else {
        return new BigNumber(0);
    }
  }

  public addBalance(owner: string, token: string, tranche: string, amount: BigNumber) {
    assert(owner !== undefined);
    assert(token !== undefined);
    assert(tranche !== undefined);
    if (!this.balances[owner]) {
      this.balances[owner] = {};
    }
    if (!this.balances[owner][token]) {
      this.balances[owner][token] = {};
    }
    if (!this.balances[owner][token][tranche]) {
      this.balances[owner][token][tranche] = new BigNumber(0);
    }
    this.balances[owner][token][tranche] = this.balances[owner][token][tranche].plus(amount);
  }

  public isBalanceKnown(owner: string, token: string, tranche: string) {
    return (this.balances[owner] && this.balances[owner][token] && this.balances[owner][token][tranche]);
  }

  public copy() {
    const balanceBook = new BalanceBook();
    for (const owner of Object.keys(this.balances)) {
      for (const token of Object.keys(this.balances[owner])) {
        for (const tranche of Object.keys(this.balances[owner][token])) {
          balanceBook.addBalance(owner, token, tranche, this.balances[owner][token][tranche]);
        }
      }
    }
    return balanceBook;
  }

  public getData() {
    return this.balances;
  }

}