import { getOctokit } from '@actions/github';

import { heading } from './comment-body/strings.json';

export const MESSAGE_HEADING = `## ${heading}`;

export async function fetchPreviousComment(
    octokit: ReturnType<typeof getOctokit>,
    repo: { owner: string; repo: string },
    pr: { number: number }
) {
    const commentList = await octokit.paginate(
        'GET /repos/:owner/:repo/issues/:issue_number/comments',
        {
            ...repo,
            issue_number: pr.number,
        }
    );

    const sizeLimitComment = commentList.find((comment) =>
        (comment as { body: string }).body.startsWith(MESSAGE_HEADING)
    );
    return !sizeLimitComment ? null : sizeLimitComment;
}