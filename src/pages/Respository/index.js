import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container';
import {
    Loading,
    Owner,
    IssueList,
    FilterIssue,
    NavigationIssueList,
    FormControl,
} from './styles';

export default class Respository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        state: 'all',
        page: 1,
        perPage: 5,
        loading: true,
    };

    componentDidMount() {
        this.loadRepository();
    }

    componentDidUpdate(_, prevState) {
        const { perPage, page, state } = this.state;
        if (
            perPage !== prevState.perPage ||
            page !== prevState.page ||
            state !== prevState.state
        ) {
            this.loadRepository();
        }
    }

    handleChangeIssueIssue = e => {
        this.setState({
            state: e.target.value,
        });
    };

    handleNextPage = () => {
        const { page } = this.state;
        this.setState({ page: page + 1 });
    };

    handlePrevPage = () => {
        const { page } = this.state;
        this.setState({ page: page - 1 });
    };

    handleChangePerPage = e => {
        this.setState({ perPage: e.target.value });
    };

    async loadRepository() {
        const { match } = this.props;
        const { state, page, perPage } = this.state;

        const repoName = decodeURIComponent(match.params.repository);

        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName}/issues`, {
                params: {
                    state,
                    page,
                    per_page: perPage,
                },
            }),
        ]);

        this.setState({
            loading: false,
            issues: issues.data,
            repository: repository.data,
        });
    }

    render() {
        const { repository, issues, loading, page } = this.state;

        if (loading) {
            return <Loading>Carregando</Loading>;
        }

        return (
            <Container>
                <Owner>
                    <Link to="/">Voltar aos repositórios</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>
                <FilterIssue>
                    <FormControl>
                        <label>State Issue</label>
                        <select
                            id="stateIssue"
                            onChange={this.handleChangeIssueIssue}
                        >
                            <option value="all">All</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </FormControl>
                    <FormControl>
                        <label>Issue Por Pagina</label>
                        <select onChange={this.handleChangePerPage}>
                            <option value="5">5</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                        </select>
                    </FormControl>
                </FilterIssue>

                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
                <NavigationIssueList>
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={this.handlePrevPage}
                    >
                        Anterior
                    </button>
                    <p>{`Page: ${page}`}</p>
                    <button type="button" onClick={this.handleNextPage}>
                        Proximo
                    </button>
                </NavigationIssueList>
            </Container>
        );
    }
}
