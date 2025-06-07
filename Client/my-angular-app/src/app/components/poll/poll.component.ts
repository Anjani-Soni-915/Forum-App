import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Topic } from '../../shared/interface/topic.interface';
import { PollService } from '../../shared/services/poll.service';
import { PollVoteInput } from '../../shared/interface/poll.interface';

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
})
export class PollComponent implements OnInit {
  @Input() PollDataTopic!: Topic;

  hasUserVoted: boolean = false;
  votedOptionId: number | null = null;
  totalVotes: number = 0;
  votePercentages: { [optionId: number]: number } = {};

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.prepareDataForPoll();
  }

  prepareDataForPoll(): void {
    const userId = Number(localStorage.getItem('userId'));
    console.log(userId);
    const voteRecord = this.PollDataTopic.pollVoteData?.find(
      (vote) => vote.userId === userId
    );
    console.log(voteRecord);
    if (voteRecord) {
      this.hasUserVoted = true;
      this.votedOptionId = voteRecord.pollOptionId;
    }

    const options = this.PollDataTopic.pollData[0].options;
    this.totalVotes = options.reduce(
      (sum, option) => sum + option.voteCount,
      0
    );
    console.log(this.totalVotes);
    options.forEach((option) => {
      const percentage =
        this.totalVotes > 0
          ? Number(((option.voteCount / this.totalVotes) * 100).toFixed(1))
          : 0;
      this.votePercentages[option.id] = percentage;
    });
  }

  onPollOptionClicked(
    event: Event,
    pollOptionId: number,
    userId: number,
    topicId: number
  ): void {
    event.stopPropagation();

    if (this.hasUserVoted) return;

    const newVote: PollVoteInput = { pollOptionId, topicId, userId };

    this.pollService.addPollVote(newVote).subscribe({
      next: (response) => {
        console.log('Poll vote response:', response);
        this.votedOptionId = pollOptionId;
        this.hasUserVoted = true;

        // Update local vote count manually for now
        const option = this.PollDataTopic.pollData[0].options.find(
          (o) => o.id === pollOptionId
        );
        if (option) option.voteCount++;

        this.prepareDataForPoll(); // Recalculate totals and percentages
      },
      error: (err) => {
        console.error('Error posting vote:', err);
      },
    });
  }

  getPollPercentage(option: any) {
    return this.votePercentages[option.id] + '%';
  }
}
