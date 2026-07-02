import { utils, writeFile } from 'xlsx';
import { toCompact, toLongForm, adjustedSeconds } from '../utils/formatDuration';

export default function ExportExcelButton({ data, type }) {
  const handleExport = () => {
    const wb = utils.book_new();

    // ── Summary sheet ──────────────────────────────────────────────
    const summaryTitle  = type === 'playlist' ? data.title : (data.title || 'Video');
    const totalSecs     = type === 'playlist' ? data.totalDurationSeconds : data.durationSeconds;

    const summaryRows = [
      ['PlaylistTime — Duration Summary'],
      [],
      ['Title',    summaryTitle],
      ['Channel',  data.channelTitle || ''],
      ['Type',     type === 'playlist' ? 'Playlist' : 'Video'],
    ];

    if (type === 'playlist') {
      summaryRows.push(['Videos', `${data.fetchedVideoCount} of ${data.requestedVideoCount}`]);
    }

    summaryRows.push(
      [],
      ['Total Duration (seconds)', totalSecs],
      ['Total Duration',           toLongForm(totalSecs)],
      [],
      ['Speed', 'Adjusted Duration'],
      ['1x',    toLongForm(totalSecs)],
      ['1.25x', toLongForm(adjustedSeconds(totalSecs, 1.25))],
      ['1.5x',  toLongForm(adjustedSeconds(totalSecs, 1.5))],
      ['1.75x', toLongForm(adjustedSeconds(totalSecs, 1.75))],
      ['2x',    toLongForm(adjustedSeconds(totalSecs, 2))],
    );

    const summaryWS = utils.aoa_to_sheet(summaryRows);
    utils.book_append_sheet(wb, summaryWS, 'Summary');

    // ── Videos sheet (playlist only) ──────────────────────────────
    if (type === 'playlist' && data.videos?.length) {
      const videoRows = [
        ['#', 'Video Title', 'Duration', 'Duration (seconds)', 'URL'],
        ...data.videos.map((v, i) => [
          i + 1,
          v.title,
          toCompact(v.durationSeconds),
          v.durationSeconds,
          `https://www.youtube.com/watch?v=${v.id}`,
        ]),
      ];
      const videosWS = utils.aoa_to_sheet(videoRows);
      // Set column widths
      videosWS['!cols'] = [{ wch: 5 }, { wch: 60 }, { wch: 12 }, { wch: 20 }, { wch: 50 }];
      utils.book_append_sheet(wb, videosWS, 'Videos');
    }

    const filename = `PlaylistTime_${(summaryTitle || 'export').replace(/[^a-z0-9]/gi, '_').slice(0, 40)}.xlsx`;
    writeFile(wb, filename);
  };

  return (
    <button id="export-excel-btn" onClick={handleExport} className="btn-secondary">
      📊 Export to Excel
    </button>
  );
}
