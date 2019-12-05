import React from "react";
import { comparisons } from "../functions/config";
import { metaLeagues, fetchLeagues } from "../functions/leagues";
import { fetchItems, comparePrice } from "../functions/items";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comparisonsByGroup: comparisons(),
      selectedMetaLeague: "Temp SC",
    };
  }

  componentDidMount() {
    const { selectedMetaLeague } = this.state;

    fetchLeagues().then(leagues => {
      console.log(`Leagues: ${JSON.stringify(leagues)}`);
      this.setState(
        { leagues, selectedLeague: leagues[selectedMetaLeague] },
        () => this.updateItems()
      );
    });
  }

  render() {
    const { selectedMetaLeague, comparisonsByGroup } = this.state;

    return (
      <div>
        <h2>League:</h2>
        <select
          name="league"
          value={selectedMetaLeague}
          onChange={event => this.leagueSelected(event)}
        >
          {metaLeagues().map(league => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>

        <h2>Differences:</h2>
        <ol>
          {Object.keys(comparisonsByGroup).map(group => (
            <div key={group}>
              <h3>{group}</h3>
              {comparisonsByGroup[group].map((comparison, i) => (
                <li key={i}>
                  <label>{this.comparisonText(comparison)}</label>
                </li>
              ))}
            </div>
          ))}
        </ol>
      </div>
    );
  }

  comparisonText(comparison) {
    let text = `${comparison.name}: ${this.compare(
      comparison.base,
      comparison.compare
    )} chaos`;
    if (comparison.comment) {
      text += ` (${comparison.comment})`;
    }

    return text;
  }

  updateItems() {
    fetchItems(this.state.selectedLeague).then(items => {
      this.setState({ items });
    });
  }

  leagueSelected(event) {
    const selectedLeague = this.state.leagues[event.target.value];
    this.setState(
      {
        selectedLeague,
        selectedMetaLeague: event.target.value,
      },
      () => this.updateItems()
    );
  }

  compare(base, compare) {
    if (
      !this.state.selectedLeague ||
      !this.state.items ||
      !this.state.items[this.state.selectedLeague]
    ) {
      return "?";
    }

    const comparison = comparePrice(
      this.state.items,
      this.state.selectedLeague,
      base,
      compare
    );

    if (!comparison) {
      return "N/A";
    }
    return comparison;
  }
}

export default App;
