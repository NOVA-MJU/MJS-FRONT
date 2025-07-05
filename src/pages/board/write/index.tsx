import { IoIosArrowBack } from 'react-icons/io';
import { Typography } from '../../../components/atoms/Typography';
import IconButton from '../../../components/atoms/IconButton';
import Markdown from 'react-markdown';
import '../markdown.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BoardWrite() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function normalizeNewlines(input: string): string {
    return input
      .replace(/\r\n/g, '\n')
      .replace(/\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n');
  }

  // heading 추가 function
  const toggleHeading = (level: 1 | 2 | 3) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { value, selectionStart: start, selectionEnd: end } = ta;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const nextNL = value.indexOf('\n', start);
    const lineEnd = nextNL < 0 ? value.length : nextNL;

    const prefix = '#'.repeat(level) + ' ';
    const line = value.slice(lineStart, lineEnd);
    const added = line.startsWith(prefix);
    const newLine = added ? line.slice(prefix.length) : prefix + line;

    const newVal = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
    ta.value = newVal;
    const pos = added ? start - prefix.length : start + prefix.length;
    ta.setSelectionRange(pos, pos + (end - start));
    ta.focus();
    setContent(normalizeNewlines(newVal));
  };

  // bold 추가 function
  const toggleBold = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { value, selectionStart: start, selectionEnd: end } = ta;
    let newStart = start,
      newEnd = end;

    const prefix = value.slice(start - 2, start);
    const suffix = value.slice(end, end + 2);

    if (start >= 2 && end + 2 <= value.length && prefix === '**' && suffix === '**') {
      ta.value = value.slice(0, start - 2) + value.slice(start, end) + value.slice(end + 2);
      newStart = start - 2;
      newEnd = end - 2;
    } else {
      if (start !== end) {
        ta.value = value.slice(0, start) + '**' + value.slice(start, end) + '**' + value.slice(end);
        newStart = start + 2;
        newEnd = end + 2;
      } else {
        ta.value = value.slice(0, start) + '****' + value.slice(start);
        newStart = newEnd = start + 2;
      }
    }

    ta.focus();
    ta.setSelectionRange(newStart, newEnd);
    setContent(normalizeNewlines(ta.value));
  };

  // italic 추가 function
  const toggleItalic = () => {
    const ta = textareaRef.current;
    if (!ta) return;

    const { value, selectionStart: start, selectionEnd: end } = ta;
    let newStart = start,
      newEnd = end;

    const prefix = value.slice(start - 2, start);
    const suffix = value.slice(end, end + 2);

    if (start >= 2 && end + 2 <= value.length && prefix === ' _' && suffix === '_ ') {
      ta.value = value.slice(0, start - 2) + value.slice(start, end) + value.slice(end + 2);
      newStart = start - 2;
      newEnd = end - 2;
    } else {
      if (start !== end) {
        ta.value = value.slice(0, start) + ' _' + value.slice(start, end) + '_ ' + value.slice(end);
        newStart = start + 2;
        newEnd = end + 2;
      } else {
        ta.value = value.slice(0, start) + ' __ ' + value.slice(start);
        newStart = newEnd = start + 2;
      }
    }

    ta.focus();
    ta.setSelectionRange(newStart, newEnd);
    setContent(normalizeNewlines(ta.value));
  };

  // 이미지 추가 function
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ta = textareaRef.current!;

    // TODO 이 파일을 업로드해야함
    const file = e.dataTransfer.files[0];
    if (!file) return;
    console.log(file.type.startsWith('image/') ? '이미지입니다' : '이미지가 아닙니다');

    const imgCaption = `\n![업로드중]()\n`;
    const { selectionStart, selectionEnd, value } = ta;

    ta.value = value.slice(0, selectionStart) + imgCaption + value.slice(selectionEnd);

    ta.selectionStart = ta.selectionEnd = selectionStart + imgCaption.length;
    ta.focus();
    setContent(normalizeNewlines(ta.value));
  };

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const ta = textareaRef.current!;

    // TODO 이 파일을 업로드해야함
    const file = event.target.files?.[0];
    if (!file) return;

    const imgCaption = `\n![업로드중]()\n`;
    const { selectionStart, selectionEnd, value } = ta;

    ta.value = value.slice(0, selectionStart) + imgCaption + value.slice(selectionEnd);

    ta.selectionStart = ta.selectionEnd = selectionStart + imgCaption.length;
    ta.focus();
    setContent(normalizeNewlines(ta.value));
  }

  function handleImageUploadClick(): void {
    fileInputRef.current?.click();
  }

  return (
    <div className='w-full h-screen px-9 py-12 gap-6 flex flex-col'>
      <Typography variant='heading01' className='text-mju-primary'>
        자유게시판
      </Typography>
      <hr className='w-full h-[4px] bg-gradient-to-r from-blue-05 to-white rounded-full border-0' />

      <div className='w-full flex justify-between'>
        <div className='flex items-center cursor-pointer gap-2' onClick={() => navigate(-1)}>
          <IoIosArrowBack className='text-[16px] text-blue-10' />
          <Typography variant='body03' className='text-blue-10'>
            이전
          </Typography>
        </div>
        <div className='flex items-center gap-6'>
          <button className='w-46 bg-white border-2 border-grey-10 cursor-pointer p-3 rounded-xl flex'>
            <div className='flex-1'>
              <Typography variant='body02' className='text-black'>
                임시저장
              </Typography>
            </div>
            <Typography variant='body02' className='text-blue-35'>
              00
            </Typography>
          </button>
          <button className='w-46 bg-grey-10 cursor-pointer p-3 rounded-xl'>
            <Typography variant='body02' className='text-black'>
              완료
            </Typography>
          </button>
        </div>
      </div>

      <input
        className='p-3 placeholder-grey-20 font-bold text-[28px] border-2 border-blue-05 rounded-xl focus:bg-blue-05 focus:outline-none'
        placeholder='제목'
      />

      <div className='h-full flex gap-6'>
        <div className='basis-3/5 flex-shrink-0 flex flex-col gap-3'>
          <div className='flex gap-6 px-6 py-3 bg-grey-05 rounded-xl'>
            <div className='flex gap-3'>
              <IconButton onClick={() => toggleHeading(1)}>
                <Typography variant='body02' className='text-black'>
                  H1
                </Typography>
              </IconButton>
              <IconButton onClick={() => toggleHeading(2)}>
                <Typography variant='body02' className='text-black'>
                  H2
                </Typography>
              </IconButton>
              <IconButton onClick={() => toggleHeading(3)}>
                <Typography variant='body02' className='text-black'>
                  H3
                </Typography>
              </IconButton>
            </div>
            <hr className='w-0 h-6 border-1 border-grey-10' />
            <div className='flex gap-3'>
              <IconButton onClick={() => toggleBold()}>
                <Typography variant='body02' className='text-black'>
                  B
                </Typography>
              </IconButton>
              <IconButton onClick={() => toggleItalic()}>
                <Typography variant='body02' className='text-black'>
                  I
                </Typography>
              </IconButton>
              <IconButton>
                <Typography variant='body02' className='text-black'>
                  S
                </Typography>
              </IconButton>
            </div>
            <hr className='w-0 h-6 border-1 border-grey-10' />
            <div className='flex gap-3'>
              <IconButton onClick={handleImageUploadClick}>
                <Typography variant='body02' className='text-black'>
                  ☒
                </Typography>
              </IconButton>
              <IconButton>
                <Typography variant='body02' className='text-black'>
                  ☒
                </Typography>
              </IconButton>
              <IconButton>
                <Typography variant='body02' className='text-black'>
                  ☒
                </Typography>
              </IconButton>
              <IconButton>
                <Typography variant='body02' className='text-black'>
                  ☒
                </Typography>
              </IconButton>
            </div>
          </div>

          <textarea
            className='h-full p-3 placeholder-grey-20 text-[16px] leading-[150%] border-2 border-grey-05 rounded-xl focus:bg-blue-05 focus:outline-none focus:border-blue-05'
            placeholder='자유롭게 말을 남겨보세요'
            ref={textareaRef}
            onChange={(e) => setContent(normalizeNewlines(e.target.value))}
            onDrop={handleDrop}
          />
        </div>

        <div className='basis-2/5 flex-shrink-0 flex flex-col gap-3'>
          <div className='flex gap-6 px-6 py-2 bg-grey-05 rounded-xl'>
            <Typography variant='title02' className='text-black'>
              미리보기
            </Typography>
          </div>
          <div className='markdown h-full p-3 border-2 border-grey-05 rounded-xl break-all'>
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </div>

      <input
        type='file'
        accept='image/*'
        ref={fileInputRef}
        className='hidden'
        onChange={handleImageChange}
      />
    </div>
  );
}
