namespace QuantumVestigesInstaller
{
    public partial class QuantumVestigesWindow : System.Windows.Window
    {
        [System.STAThread]
        public static void Main()
        {
            System.Windows.Application app = new System.Windows.Application();
            QuantumVestigesWindow windowInstaller = new QuantumVestigesWindow();
            windowInstaller.Show();

            app.Run(windowInstaller);
        }
        private const string DownloadFolder = "https://quantumvestiges-assets-devo.s3.us-west-2.amazonaws.com";
        private const string ResourceFolder = "assets";
        private const string LauncherZip = "QuantumVestigesLauncher.zip";
        private System.Windows.Controls.TextBlock TxtTitle;
        private System.Windows.Controls.TextBlock TxtStatus;
        //private System.Windows.Controls.ProgressBar ProgBar;
        //private System.Windows.Controls.TextBlock TxtPercentage;
        private System.Windows.Controls.Button BtnAction;
        private System.Windows.Controls.Grid mainGrid;
        // Directory setup
        private string CompanyName;
        private string ProgramFiles = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFiles);
        private string ApplicationData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData);
        private string LauncherInstallDir;
        private string ApplicationSetupDir;

        public QuantumVestigesWindow () {
            Title = "Quantum Vestiges";
            Height = 34 + 768 + 35;
            Width = 1408;
            WindowStartupLocation = System.Windows.WindowStartupLocation.CenterScreen;
            Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12));
            
            CompanyName = "Quantum Vestiges";
            LauncherInstallDir = System.IO.Path.Combine(ProgramFiles, CompanyName);
            ApplicationSetupDir = System.IO.Path.Combine(ApplicationData, CompanyName);
            BuildManualLayout();
        }
        private void BuildManualLayout() {
            // Core layout grid
            mainGrid = new System.Windows.Controls.Grid { };
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = new System.Windows.GridLength(1, System.Windows.GridUnitType.Star) });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });

            // 1. Title and Status block
            System.Windows.Controls.StackPanel titlePanel = new System.Windows.Controls.StackPanel { Margin = new System.Windows.Thickness(0, 0, 0, 20) };
            TxtTitle = new System.Windows.Controls.TextBlock {
                Text = CompanyName,
                FontSize = 22,
                FontWeight = System.Windows.FontWeights.Bold,
                Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC))
             };
            
            TxtStatus = new System.Windows.Controls.TextBlock {
                Text = "Download & Install Launcher",
                FontSize = 12,
                Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x8A, 0xA0, 0xA0)),
                Margin = new System.Windows.Thickness(0, 0, 0, 0)
            };
            titlePanel.Children.Add(TxtTitle);
            titlePanel.Children.Add(TxtStatus);
            System.Windows.Controls.Grid.SetRow(titlePanel, 0);
            mainGrid.Children.Add(titlePanel);
            // 2. Set background & icon
            System.Windows.Media.ImageSource backgroundSource = SetupImage("background.jpg");
            System.Windows.Media.ImageSource iconSource = SetupImage("icon.png");
            System.Windows.Controls.Image backgroundImage = new System.Windows.Controls.Image {
                Stretch = System.Windows.Media.Stretch.UniformToFill,
                Source = backgroundSource,
                Opacity = 1,
                MinHeight = 768,
                MinWidth = 1408,
                MaxHeight = 768,
                MaxWidth = 1408,
            };
            System.Windows.Controls.Grid.SetRow(backgroundImage, 0);
            mainGrid.Children.Add(backgroundImage);
            System.Windows.Controls.Image iconImage = new System.Windows.Controls.Image { Source = iconSource, Width = 64, Height = 64, HorizontalAlignment = System.Windows.HorizontalAlignment.Left };

            // 3. Action Button layout
            BtnAction = new System.Windows.Controls.Button {
                Content = "INSTALL",
                Height = 35,
                Width = 120,
                HorizontalAlignment = System.Windows.HorizontalAlignment.Right,
                FontWeight = System.Windows.FontWeights.Bold,
                BorderThickness = new System.Windows.Thickness(0),
                Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)), Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12)),
                Visibility = System.Windows.Visibility.Visible
            };
            BtnAction.Click += BtnAction_Click; // Attaching the click handler
            System.Windows.Controls.Grid.SetRow(BtnAction, 2);
            mainGrid.Children.Add(BtnAction);

            // Add the fully constructed grid to the window
            Content = mainGrid;
        }

        private System.Windows.Media.ImageSource SetupImage(string filename) {
            try {
                System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
                string resourceName = $"{assembly.GetName().Name}.{ResourceFolder}.{filename}";

                using (System.IO.Stream stream = assembly.GetManifestResourceStream(resourceName)) {
                    if (stream == null) {
                        throw new System.IO.FileNotFoundException($"Could not find embedded resource: {resourceName}");
                    }

                    // 3. Decode the stream into a safe, thread-detached WriteableBitmap
                    System.Windows.Media.Imaging.BitmapImage bitmap = new System.Windows.Media.Imaging.BitmapImage();
                    bitmap.BeginInit();
                    bitmap.StreamSource = stream;
                    bitmap.CacheOption = System.Windows.Media.Imaging.BitmapCacheOption.OnLoad; // Forces full stream reading immediately
                    bitmap.EndInit();

                    // Convert to WriteableBitmap to prevent any unexpected layout thread ownership locks
                    System.Windows.Media.Imaging.WriteableBitmap neutralSource = new System.Windows.Media.Imaging.WriteableBitmap(bitmap);
                    neutralSource.Freeze(); // Render thread optimization

                    return neutralSource;
                }
            } catch (System.Exception ex) {
                return null;
            }
        }

        private async void BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            string launcherZipPath = System.IO.Path.Combine(System.IO.Path.GetTempPath(), CompanyName, $"{LauncherZip}");
            BtnAction.IsEnabled = false;
            try {
                TxtStatus.Text = $"Downloading {CompanyName}'s Launcher";
                await DownloadGameWithProgressAsync($"{DownloadFolder}/${LauncherZip}", launcherZipPath);
                await System.Threading.Tasks.Task.Run(() => {
                    TxtStatus.Text = "Setting up local directories";
                    System.IO.Directory.CreateDirectory(ApplicationSetupDir);
                    System.IO.Directory.CreateDirectory(LauncherInstallDir);
                    TxtStatus.Text = "Extracting files";
                    System.IO.Compression.ZipFile.ExtractToDirectory(launcherZipPath, LauncherInstallDir);
                    System.IO.File.Delete(launcherZipPath);
                });
            } catch (System.Exception ex) {
                System.Windows.MessageBox.Show(ex.Message, "Failed to set up launcher", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
            } finally {
                BtnAction.IsEnabled = true;
            }
        }

        private async System.Threading.Tasks.Task DownloadGameWithProgressAsync(string url, string destinationPath)
        {
            using System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
            using System.Net.Http.HttpResponseMessage response = await client.GetAsync(url, System.Net.Http.HttpCompletionOption.ResponseHeadersRead);
            response.EnsureSuccessStatusCode();

            long? totalBytes = response.Content.Headers.ContentLength;

            using System.IO.Stream downloadStream = await response.Content.ReadAsStreamAsync();
            using System.IO.FileStream fileStream = new System.IO.FileStream(destinationPath, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.None, 8192, true);

            byte[] buffer = new byte[8192];
            //long totalReadBytes = 0;
            int readBytes;

            while ((readBytes = await downloadStream.ReadAsync(buffer, 0, buffer.Length)) > 0) {
                await fileStream.WriteAsync(buffer, 0, readBytes);
            //     totalReadBytes += readBytes;

            //     if (totalBytes.HasValue)
            //     {
            //         double progress = (double)totalReadBytes / totalBytes.Value * 100;
            //         // Update progress bar on UI thread smoothly
            //         Dispatcher.Invoke(() => {
            //             ProgBar.Value = progress;
            //             TxtPercentage.Text = $"{Math.Round(progress)}%";
            //         });
            //     }
            }
        }
    }
}
