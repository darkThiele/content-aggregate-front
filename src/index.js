import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
    state = {qiita: {}, github: [], hack: [], gigazine: [], time: new Date()}


    qiitaResolve(base) {
        return axios.get(base + 'get_contents/qiita').then(res => res.data)
    }

    gigaResolve(base) {
        return axios.get(base + 'get_contents/gigazine').then(res => res.data)
    }

    githubResolve(base) {
        return axios.get(base + 'get_contents/github_trending').then(res => res.data)
    }

    hackerResolve(base) {
        return axios.get(base + 'get_contents/hacker_news').then(res => res.data)
    }



    async componentDidMount() {

        this.update = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1 * 1000); // every 1 seconds

        const base = 'http://127.0.0.1:5000/api/'
        const [qiita, gigazine, github, hack] = await Promise.all([
            this.qiitaResolve(base),
            this.gigaResolve(base),
            this.githubResolve(base),
            this.hackerResolve(base),
        ])

        this.setState({qiita, github, hack, gigazine});
    };

    componentWillUnmount() {
        clearInterval(this.update)
    }

    render() {
        return (
            <div className="ui segment inverted">
                <div className="ui pointing menu container">
                    <div className="active item">Contents Aggregator</div>
                    <div className="right menu">
                        <div className="ui item">
                            {this.state.time.toLocaleTimeString()}
                        </div>
                    </div>
                </div>
                <div className="ui four column doubling stackable grid container">
                    <div className="column">
                        <div className="ui relaxed divided list">
                            {this.state.qiita.trend && this.state.qiita.trend.edges.map((edge) => {
                                return (
                                    <a href={`https://qiita.com/${edge.node.author.urlName}/items/${edge.node.uuid}`} className="ui card item">
                                        <div className="content">
                                            <div className="ui tiny header">{edge.node.title}</div>
                                            <div className="meta">
                                                <div className="description">
                                                    {edge.node.createdAt}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui relaxed divided list">
                            {this.state.github && this.state.github.map((entry) => {
                                return (
                                    <a href={entry.url} className="ui card item">
                                        <div className="content">
                                            <div className="ui tiny header">{entry.name}</div>
                                            <div className="meta">
                                                <div className="description">
                                                    {entry.description}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui relaxed divided list">
                            {this.state.hack && this.state.hack.map((entry) => {
                                return (
                                    <a href={entry.url} className="ui card item">
                                        <div className="content">
                                            <div className="ui tiny header">{entry.title}</div>
                                            <div className="meta">
                                                <span className="category">{entry.type}</span>
                                                <div className="description">
                                                    {entry.score}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui relaxed divided list">
                            {this.state.gigazine && this.state.gigazine.map((entry) => {
                                return (
                                    <a href={entry.url} className="ui card item">
                                        <div className="content">
                                            <div className="ui tiny header">{entry.title}</div>
                                            <div className="meta">
                                                <div className="description">
                                                    {entry.created_at}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);